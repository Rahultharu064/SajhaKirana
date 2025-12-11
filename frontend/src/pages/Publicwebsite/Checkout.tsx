import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../Redux/store';
import Button from '../../components/ui/Button';
import PaymentMethod from '../../components/Publicwebsite/Checkout/PaymentMethod';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';

const Checkout = () => {
    const navigate = useNavigate();
    const { items, total } = useSelector((state: RootState) => state.cart);
    const { user } = useSelector((state: RootState) => state.auth);

    // Start at step 1 (Address)
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Address State matching AddressData interface
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        district: '',
        landmark: '',
    });

    // Payment Method State
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'esewa' | 'khalti'>('cod');

    useEffect(() => {
        // Redirect if not logged in
        if (!user) {
            navigate('/login?redirect=/checkout');
            return;
        }
        // Redirect if cart is empty
        if (items.length === 0) {
            navigate('/cart');
            return;
        }
        // Pre-fill email and name from user if available
        if (user) {
            setShippingAddress(prev => ({
                ...prev,
                email: user.email || '',
                fullName: user.name || '',
                phone: user.phone || ''
            }));
        }
    }, [user, items, navigate]);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Validate address
            if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.district) {
                toast.error('Please fill in all required address fields');
                setStep(1);
                setLoading(false);
                return;
            }

            const payload = {
                userId: user.userId, // Updated to match authSlice User interface
                shippingAddress,
                paymentMethod,
                items: items.map(item => ({
                    sku: item.sku,
                    qty: item.quantity,
                    price: item.price
                }))
            };

            const response = await orderService.createOrder(payload);
            const { data } = response.data; // Response wrapper { success: true, data: { ... } }

            if (response.data.success) {
                // Determine next step based on payment method
                if (paymentMethod === 'cod') {
                    toast.success('Order placed successfully!');
                    // Redirect to success page or order details
                    navigate('/payment/success');
                } else if (paymentMethod === 'esewa') {
                    // eSewa specific handling
                    const esewaData = data.data;

                    if (esewaData && esewaData.esewaConfig) {
                        // Create a hidden form and submit it to eSewa
                        const form = document.createElement('form');
                        form.action = esewaData.esewaURL;
                        form.method = 'POST';

                        Object.keys(esewaData.esewaConfig).forEach(key => {
                            const input = document.createElement('input');
                            input.type = 'hidden';
                            input.name = key;
                            input.value = esewaData.esewaConfig[key];
                            form.appendChild(input);
                        });

                        document.body.appendChild(form);
                        form.submit();
                    } else {
                        toast.error('Failed to initiate eSewa payment');
                    }
                } else if (paymentMethod === 'khalti') {
                    // Khalti specific handling
                    const khaltiData = data.data;

                    if (khaltiData && khaltiData.paymentUrl) {
                        window.location.href = khaltiData.paymentUrl;
                    } else {
                        toast.error('Failed to initiate Khalti payment');
                    }
                }
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            const msg = error.response?.data?.error?.message || 'Failed to place order';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Forms */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Step 1: Shipping Address */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold flex items-center">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 text-sm">1</div>
                                Shipping Address
                            </h2>
                            {step === 2 && (
                                <button onClick={() => setStep(1)} className="text-emerald-600 text-sm hover:underline">Edit</button>
                            )}
                        </div>

                        {(step === 1 || step === 2) && (
                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${step === 2 ? 'opacity-50 pointer-events-none' : ''}`}>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={shippingAddress.fullName}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={shippingAddress.phone}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingAddress.email}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={shippingAddress.address}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="District, Street"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingAddress.city}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={shippingAddress.district}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={shippingAddress.landmark}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="mt-6 flex justify-end">
                                <Button
                                    onClick={() => {
                                        if (shippingAddress.fullName && shippingAddress.phone && shippingAddress.address && shippingAddress.city && shippingAddress.district) {
                                            setStep(2);
                                        } else {
                                            toast.error('Please fill in required fields');
                                        }
                                    }}
                                >
                                    Continue to Payment
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Payment Method */}
                    {step === 2 && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 text-sm">2</div>
                                    Payment Method
                                </h2>
                            </div>

                            <PaymentMethod
                                selectedMethod={paymentMethod}
                                onSelect={setPaymentMethod}
                            />
                        </div>
                    )}
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-4 max-h-80 overflow-y-auto mb-4 custom-scrollbar">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 py-2 border-b last:border-0">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm text-gray-900 line-clamp-2">{item.sku}</p>
                                        {/* Ideally we should store title in cart item or fetch it. For now using SKU or if title is there */}
                                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-sm">Rs. {item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>Rs. {total}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                                <span>Total</span>
                                <span>Rs. {total}</span>
                            </div>
                        </div>

                        {step === 2 && (
                            <Button
                                variant="primary"
                                className="w-full mt-6"
                                size="lg"
                                onClick={handlePlaceOrder}
                                loading={loading}
                            >
                                Place Order
                            </Button>
                        )}

                        <Button
                            variant="secondary"
                            className="w-full mt-3"
                            onClick={() => navigate('/cart')}
                        >
                            Back to Cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
