import { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import type { DeliveryOption } from '../../types/common';

interface DeliveryOptionsProps {
  selectedOption: DeliveryOption | null;
  onSubmit: (option: DeliveryOption) => void;
  onBack: () => void;
}

const deliveryOptions: DeliveryOption[] = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: 'Delivered in 3-5 business days',
    price: 150,
    estimatedDays: '3-5'
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Delivered in 1-2 business days',
    price: 300,
    estimatedDays: '1-2'
  },
  {
    id: 'next-day',
    name: 'Next Day Delivery',
    description: 'Delivered by tomorrow',
    price: 500,
    estimatedDays: '1'
  },
  {
    id: 'free',
    name: 'Free Delivery',
    description: 'Delivered in 7-10 business days (orders over Rs. 5000)',
    price: 0,
    estimatedDays: '7-10'
  }
];

const DeliveryOptions = ({ selectedOption, onSubmit, onBack }: DeliveryOptionsProps) => {
  const [selected, setSelected] = useState<DeliveryOption | null>(selectedOption);

  const handleSubmit = () => {
    if (selected) {
      onSubmit(selected);
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
          <Truck className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Choose Delivery Option
        </h2>
        <p className="text-muted-foreground">
          Select how you want your order delivered
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {deliveryOptions.map((option) => (
          <motion.div
            key={option.id}
            className={`
              p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg
              ${selected?.id === option.id
                ? 'border-primary bg-primary/5 shadow-lg'
                : 'border-border bg-background hover:border-primary/30'
              }
            `}
            onClick={() => setSelected(option)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {selected?.id === option.id && (
                    <CheckCircle className="w-6 h-6 text-primary" />
                  )}
                  <h3 className="text-lg font-semibold text-foreground">{option.name}</h3>
                </div>

                <p className="text-muted-foreground mb-3">{option.description}</p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Estimated delivery: {option.estimatedDays} business days</span>
                </div>
              </div>

              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-foreground">
                  {option.price === 0 ? 'FREE' : `Rs. ${option.price}`}
                </div>
                {option.price === 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    (Orders over Rs. 5000)
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/50 rounded-lg p-4 mb-6"
        >
          <h4 className="font-semibold text-foreground mb-2">Selected Delivery Option:</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{selected.name}</p>
              <p className="text-sm text-muted-foreground">Delivery in {selected.estimatedDays} business days</p>
            </div>
            <div className="text-xl font-bold">
              {selected.price === 0 ? 'FREE' : `Rs. ${selected.price}`}
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
          disabled={!selected}
        >
          Continue to Payment
        </Button>
      </div>
    </motion.div>
  );
};

export default DeliveryOptions;
