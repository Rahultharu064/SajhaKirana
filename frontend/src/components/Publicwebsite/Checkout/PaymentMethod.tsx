import React from 'react';
import { Banknote, Wallet } from 'lucide-react';

interface PaymentMethodProps {
    selectedMethod: 'cod' | 'esewa' | 'khalti';
    onSelect: (method: 'cod' | 'esewa' | 'khalti') => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ selectedMethod, onSelect }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                    className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center transition-all ${selectedMethod === 'esewa'
                            ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200'
                            : 'border-gray-200 hover:border-emerald-200'
                        }`}
                    onClick={() => onSelect('esewa')}
                >
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-2 text-green-600">
                        <Wallet size={24} />
                    </div>
                    <span className="font-medium">eSewa</span>
                </div>

                <div
                    className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center transition-all ${selectedMethod === 'khalti'
                            ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                            : 'border-gray-200 hover:border-purple-200'
                        }`}
                    onClick={() => onSelect('khalti')}
                >
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-2 text-purple-600">
                        <Wallet size={24} />
                    </div>
                    <span className="font-medium">Khalti</span>
                </div>

                <div
                    className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center transition-all ${selectedMethod === 'cod'
                            ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                            : 'border-gray-200 hover:border-orange-200'
                        }`}
                    onClick={() => onSelect('cod')}
                >
                    <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-2 text-orange-600">
                        <Banknote size={24} />
                    </div>
                    <span className="font-medium">Cash On Delivery</span>
                </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
                {selectedMethod === 'esewa' && (
                    <p>You will be redirected to eSewa to complete your payment securely.</p>
                )}
                {selectedMethod === 'khalti' && (
                    <p>You will be redirected to Khalti to complete your payment securely.</p>
                )}
                {selectedMethod === 'cod' && (
                    <p>Pay with cash when your order is delivered. Please have exact change ready.</p>
                )}
            </div>
        </div>
    );
};

export default PaymentMethod;
