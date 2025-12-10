import { motion } from 'framer-motion';
import { CheckCircle, MapPin, Truck, CreditCard, Package } from 'lucide-react';
import Button from '../ui/Button';
import type { AddressData, DeliveryOption, PaymentMethodData } from '../../types/common';

interface OrderConfirmationProps {
  address: AddressData;
  delivery: DeliveryOption;
  payment: PaymentMethodData;
  onPlaceOrder: () => void;
  onBack: () => void;
  loading?: boolean;
}

const OrderConfirmation = ({ address, delivery, payment, onPlaceOrder, onBack, loading = false }: OrderConfirmationProps) => {
  const getPaymentMethodName = () => {
    switch (payment.type) {
      case 'cod': return 'Cash on Delivery';
      case 'esewa': return 'eSewa';
      case 'khalti': return 'Khalti';
      case 'card': return 'Credit/Debit Card';
      default: return 'Unknown';
    }
  };

  const formatAddress = () => {
    return `${address.address}, ${address.city}, ${address.district}${address.landmark ? `, ${address.landmark}` : ''}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Confirm Your Order
        </h2>
        <p className="text-muted-foreground">
          Please review your order details before placing the order
        </p>
      </div>

      <div className="space-y-6">
        {/* Address Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-muted/30 rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Delivery Address</h3>
          </div>
          <div className="ml-8">
            <p className="font-medium text-foreground">{address.fullName}</p>
            <p className="text-muted-foreground">{formatAddress()}</p>
            <p className="text-muted-foreground">{address.phone} | {address.email}</p>
          </div>
        </motion.div>

        {/* Delivery Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-muted/30 rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Delivery Option</h3>
          </div>
          <div className="ml-8">
            <p className="font-medium text-foreground">{delivery.name}</p>
            <p className="text-muted-foreground">{delivery.description}</p>
            <p className="text-muted-foreground">Delivery in {delivery.estimatedDays} business days</p>
            <p className="text-xl font-bold text-foreground mt-2">
              {delivery.price === 0 ? 'FREE' : `Rs. ${delivery.price}`}
            </p>
          </div>
        </motion.div>

        {/* Payment Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-muted/30 rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Payment Method</h3>
          </div>
          <div className="ml-8">
            <p className="font-medium text-foreground">{getPaymentMethodName()}</p>
            {payment.type === 'card' && payment.cardNumber && (
              <p className="text-muted-foreground">
                **** **** **** {payment.cardNumber.slice(-4)}
              </p>
            )}
          </div>
        </motion.div>

        {/* Order Summary Note */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Important Note</h3>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 ml-8">
            By placing this order, you agree to our Terms of Service and Privacy Policy.
            Your payment information is secured with industry-standard encryption.
          </p>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4 mt-8"
      >
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={onPlaceOrder}
          className="flex-1"
          size="lg"
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default OrderConfirmation;
