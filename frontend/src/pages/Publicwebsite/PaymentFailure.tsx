import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RotateCcw, ShoppingBag, ArrowRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    const orderIdFromUrl = searchParams.get('order');
    if (orderIdFromUrl) {
      setOrderId(orderIdFromUrl);
    }
  }, [searchParams]);

  const handleRetryPayment = () => {
    // Navigate back to checkout or implement retry payment logic
    navigate('/cart');
  };

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
            {/* Failure Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="w-12 h-12 text-red-600" />
            </motion.div>

            {/* Failure Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-red-600 mb-4">
                Payment Failed
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Unfortunately, your payment could not be processed. Your order was saved and you can retry the payment.
              </p>

              {orderId && (
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground">
                    Order ID: <span className="font-mono font-medium text-foreground">{orderId}</span>
                  </p>
                </div>
              )}

              {/* Possible Reasons */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-red-800 mb-2">Possible reasons:</h3>
                <ul className="text-sm text-red-700 text-left space-y-1">
                  <li>• Insufficient funds in your account</li>
                  <li>• Payment gateway error</li>
                  <li>• Network connectivity issues</li>
                  <li>• Payment cancelled by user</li>
                </ul>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <Button
                onClick={handleRetryPayment}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retry Payment
              </Button>

              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Back to Shopping
              </Button>

              {orderId && (
                <Button
                  onClick={() => navigate(`/order/confirmation/${orderId}`)}
                  variant="ghost"
                  className="w-full"
                  size="lg"
                >
                  View Order Details
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </motion.div>

            {/* Support Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20"
            >
              <p className="text-sm text-muted-foreground">
                If you continue to experience issues, please contact our
                <a href="mailto:support@localhost" className="text-primary hover:underline ml-1">
                  customer support
                </a>.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentFailure;
