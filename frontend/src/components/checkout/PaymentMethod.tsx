import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, Phone } from 'lucide-react';
import Button from '../ui/Button';
import type { PaymentMethodData } from '../../types/common';

interface PaymentMethodProps {
  selectedMethod: PaymentMethodData | null;
  onSubmit: (method: PaymentMethodData) => void;
  onBack: () => void;
}

const paymentMethods = [
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: Truck,
  },
  {
    id: 'esewa',
    name: 'eSewa',
    description: 'Pay with your eSewa wallet',
    icon: Phone,
  },
  {
    id: 'khalti',
    name: 'Khalti',
    description: 'Pay with your Khalti wallet',
    icon: Phone,
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay with your credit or debit card',
    icon: CreditCard,
  }
];

const PaymentMethod = ({ selectedMethod, onSubmit, onBack }: PaymentMethodProps) => {
  const [selected, setSelected] = useState<PaymentMethodData>(selectedMethod || { type: 'cod' });

  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateCardData = () => {
    const newErrors: {[key: string]: string} = {};

    if (selected.type === 'card') {
      // Basic card number validation (16 digits)
      const cardRegex = /^\d{16}$/;
      if (!cardRegex.test(cardData.cardNumber.replace(/\s+/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }

      // Expiry date validation MM/YY
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiryRegex.test(cardData.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }

      // CVV validation (3 digits)
      const cvvRegex = /^\d{3}$/;
      if (!cvvRegex.test(cardData.cvv)) {
        newErrors.cvv = 'Please enter a valid 3-digit CVV';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateCardData()) {
      if (selected.type === 'card') {
        onSubmit({
          ...selected,
          cardNumber: cardData.cardNumber,
          expiryDate: cardData.expiryDate,
          cvv: cardData.cvv,
        });
      } else {
        onSubmit(selected);
      }
    }
  };

  const handleCardChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Choose Payment Method
        </h2>
        <p className="text-muted-foreground">
          Select how you want to pay for your order
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <motion.div
              key={method.id}
              className={`
                p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg
                ${selected.type === method.id
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-border bg-background hover:border-primary/30'
                }
              `}
              onClick={() => setSelected({ type: method.id as any })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${selected.type === method.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{method.name}</h3>
                  <p className="text-muted-foreground">{method.description}</p>
                </div>
                {selected.type === method.id && (
                  <div className="text-primary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {selected.type === 'card' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6 mb-6"
        >
          <div className="bg-muted/50 rounded-lg p-6">
            <h4 className="font-semibold text-foreground mb-4">Card Information</h4>

            <div className="space-y-4">
              {/* Card Number */}
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardData.cardNumber}
                  onChange={(e) => handleCardChange('cardNumber', e.target.value.replace(/\D/g, '').substring(0, 16))}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                    errors.cardNumber ? 'border-destructive' : 'border-border'
                  }`}
                  placeholder="Enter 16-digit card number"
                />
                {errors.cardNumber && (
                  <p className="text-destructive text-sm mt-1">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry Date */}
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-foreground mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={cardData.expiryDate}
                    onChange={(e) => handleCardChange('expiryDate', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                      errors.expiryDate ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="MM/YY"
                  />
                  {errors.expiryDate && (
                    <p className="text-destructive text-sm mt-1">{errors.expiryDate}</p>
                  )}
                </div>

                {/* CVV */}
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-foreground mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={cardData.cvv}
                    onChange={(e) => handleCardChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 3))}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                      errors.cvv ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="123"
                  />
                  {errors.cvv && (
                    <p className="text-destructive text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1"
        >
          Review Order
        </Button>
      </div>
    </motion.div>
  );
};

export default PaymentMethod;
