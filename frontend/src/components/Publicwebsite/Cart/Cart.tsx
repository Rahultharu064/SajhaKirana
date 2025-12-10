import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart } from '../../../Redux/slices/cartSlice';
import type { RootState, AppDispatch } from '../../../Redux/store';
import Button from '../../ui/Button';
import { ShoppingBag, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, loading, error } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await dispatch(removeFromCart(cartItemId));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Please log in to view your cart</h2>
          <p className="text-gray-600">You need to be logged in to access your cart.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading cart</div>
          <Button onClick={() => dispatch(fetchCart())}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <ShoppingBag className="mr-3" />
        Your Cart
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Button variant="primary">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-8">
            {items.map((item) => (
              <div key={item.id} className="flex items-center bg-white p-6 rounded-lg shadow">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.sku} (Product)</h3>
                  <p className="text-emerald-600 font-bold">Rs. {item.price}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600 font-semibold">
                    Subtotal: Rs. {item.price * item.quantity}
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                  startIcon={<Trash2 size={16} />}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold">Total: Rs. {total}</span>
              <Button variant="primary" size="lg">
                Proceed to Checkout
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              <p>Shipping and taxes calculated at checkout.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
