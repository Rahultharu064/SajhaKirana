import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    const orderIdFromUrl = searchParams.get('order');
    if (orderIdFromUrl) {
      setOrderId(orderIdFromUrl);
    }
  }, [searchParams]);

  return (
    <Layout>
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-2xl p-8 text-center shadow-xl"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-emerald-600 mb-4">
                Payment Successful!
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Your order has been confirmed and payment processed successfully.
              </p>

              {orderId && (
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground">
                    Order ID: <span className="font-mono font-medium text-foreground">{orderId}</span>
                  </p>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <Button
                onClick={() => navigate('/')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                size="lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Continue Shopping
              </Button>

              <Button
                onClick={() => navigate(`/order/confirmation/${orderId}`)}
                variant="outline"
                className="w-full"
                size="lg"
              >
                View Order Details
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20"
            >
              <p className="text-sm text-muted-foreground">
                An order confirmation has been sent to your email. You can track your order status in your profile.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
