import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../Redux/store';

interface OrderSummaryProps {
  deliveryPrice: number;
}

const OrderSummary = ({ deliveryPrice }: OrderSummaryProps) => {
  const { items, loading } = useSelector((state: RootState) => state.cart);
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + deliveryPrice;

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background border border-border rounded-lg p-6 sticky top-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Order Summary</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Your cart is empty</p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
            {items.map((item) => {
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleProductClick(item.id)}
                  title="Click to view product details"
                >
                  <div
                    className="w-12 h-12 bg-muted rounded-md flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleProductClick(item.id)}
                    title="View product details"
                  >
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className="font-medium text-foreground text-sm truncate cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleProductClick(item.id)}
                      title="View product details"
                    >
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description || 'Product description'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-md">
                      <button
                        className="px-2 py-1 hover:bg-muted transition-colors text-sm"
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                      <button
                        className="px-2 py-1 hover:bg-muted transition-colors text-sm"
                        aria-label="Increase quantity"
                        title="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      className="p-1 hover:bg-destructive/10 text-destructive transition-colors rounded"
                      aria-label="Remove item"
                      title="Remove item"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right text-sm">
                    <p className="font-semibold text-foreground">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-muted-foreground">
                      Rs. {item.price} each
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Totals */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
              <span className="text-foreground font-medium">Rs. {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-foreground font-medium">
                {deliveryPrice === 0 ? 'FREE' : `Rs. ${deliveryPrice}`}
              </span>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">Rs. {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Summary Note */}
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground text-center">
              Prices are inclusive of all taxes. Delivery charges may vary based on your location.
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default OrderSummary;
