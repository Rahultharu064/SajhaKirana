import { ChatGroq } from '@langchain/groq';
import { prismaClient } from '../config/client';

const prisma = prismaClient;

export interface FraudCheckRequest {
    userId: number;
    orderDetails: {
        total: number;
        items: any[];
        shippingAddress: any;
        paymentMethod: string;
    };
    deviceFingerprint: string;
    ipAddress: string;
}

export interface FraudCheckResponse {
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    blockedReasons: string[];
    requiresVerification: boolean;
}

export class FraudService {
    private llm: ChatGroq;

    constructor() {
        this.llm = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: 'llama-3.3-70b-versatile',
        });
    }

    async validateFraud(req: FraudCheckRequest): Promise<FraudCheckResponse> {
        const { userId, orderDetails, ipAddress, deviceFingerprint } = req;

        const blockedReasons: string[] = [];
        let heuristicScore = 0;

        try {
            // 1. Velocity Checks (Manual heuristics)
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

            const ordersInLastHour = await prisma.order.count({
                where: {
                    OR: [
                        { userId },
                        // If we had ipAddress in Order model, we would check it here.
                        // For now, let's assume we log IP in FraudLog
                    ],
                    createdAt: { gte: oneHourAgo }
                }
            });

            if (ordersInLastHour >= 3) {
                heuristicScore += 40;
                blockedReasons.push('Rapid repeated orders detected (Velocity high)');
            }

            // 2. High Value Anomaly
            const userOrders = await prisma.order.findMany({
                where: { userId },
                select: { total: true },
                take: 10
            });

            if (userOrders.length > 0) {
                const avgTotal = userOrders.reduce((sum, o) => sum + o.total, 0) / userOrders.length;
                if (orderDetails.total > avgTotal * 3 && orderDetails.total > 2000) {
                    heuristicScore += 30;
                    blockedReasons.push('Unusually high order amount for this user');
                }
            } else if (orderDetails.total > 5000) {
                // High value for first order
                heuristicScore += 25;
                blockedReasons.push('First order value is unusually high');
            }

            // 3. AI Analysis (LLM based Pattern Recognition)
            // We pass the heuristics and raw data to the LLM for a final classification
            const aiPrompt = `
        System: You are an advanced Fraud Detection AI for Sajha Kirana, Nepal.
        Analyze the following order metadata and provide a final fraud risk score (0-100).
        
        Order Data:
        - User ID: ${userId}
        - Total Amount: Rs ${orderDetails.total}
        - Payment Method: ${orderDetails.paymentMethod}
        - IP Address: ${ipAddress}
        - Device Fingerprint: ${deviceFingerprint}
        - Heuristic Risk Score: ${heuristicScore}
        - Heuristic Flags: ${blockedReasons.join(', ')}
        
        User Data:
        - Past Orders in 1 hour: ${ordersInLastHour}
        - Historical Average: ${userOrders.length > 0 ? 'Consistent data available' : 'New User'}
        
        Suspicious Patterns to look for:
        - Multiple attempts with different payment methods
        - High value orders from new accounts
        - Unusual shopping hours
        
        Output format:
        JSON only: { "score": number, "reasons": string[], "requiresVerification": boolean }
      `;

            const aiResponse = await this.llm.invoke(aiPrompt);
            let aiResult;
            try {
                const content = aiResponse.content as string;
                const jsonMatch = content.match(/\{.*\}/s);
                aiResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { score: heuristicScore, reasons: [], requiresVerification: false };
            } catch (e) {
                aiResult = { score: heuristicScore, reasons: [], requiresVerification: false };
            }

            const finalScore = Math.max(heuristicScore, aiResult.score);
            const finalReasons = Array.from(new Set([...blockedReasons, ...aiResult.reasons]));

            let riskLevel: 'low' | 'medium' | 'high' = 'low';
            if (finalScore > 70) riskLevel = 'high';
            else if (finalScore > 30) riskLevel = 'medium';

            // Record the check in FraudLog (Note: We might need to handle the fact that generate might have failed)
            try {
                await (prisma as any).fraudLog.create({
                    data: {
                        userId,
                        ipAddress,
                        deviceFingerprint,
                        riskScore: finalScore,
                        riskLevel,
                        reasons: JSON.stringify(finalReasons),
                        orderDetails: orderDetails as any,
                    }
                });
            } catch (logError) {
                console.error('Failed to log fraud check:', logError);
            }

            return {
                riskScore: finalScore,
                riskLevel,
                blockedReasons: finalReasons,
                requiresVerification: aiResult.requiresVerification || riskLevel === 'medium' || riskLevel === 'high'
            };

        } catch (error) {
            console.error('Fraud Validation Error:', error);
            return {
                riskScore: 0,
                riskLevel: 'low',
                blockedReasons: [],
                requiresVerification: false
            };
        }
    }
}

export const fraudService = new FraudService();
