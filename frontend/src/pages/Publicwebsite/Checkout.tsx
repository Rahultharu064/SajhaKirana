import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../Redux/store';
import Button from '../../components/ui/Button';
import PaymentMethod from '../../components/Publicwebsite/Checkout/PaymentMethod';
import { orderService } from '../../services/orderService';
import { applyCoupon } from '../../services/couponService';
import type { CouponWithDiscount } from '../../services/couponService';
import toast from 'react-hot-toast';
import { Tag, X, Check } from 'lucide-react';

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

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<CouponWithDiscount | null>(null);
    const [couponLoading, setCouponLoading] = useState(false);

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

    // Calculate total with coupon discount
    const getTotalWithDiscount = () => {
        return appliedCoupon ? total - appliedCoupon.calculatedDiscount : total;
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        try {
            setCouponLoading(true);
            const result = await applyCoupon({
                code: couponCode.toUpperCase(),
                orderValue: total
            });
            setAppliedCoupon(result.coupon);
            setCouponCode('');
            toast.success(`Coupon applied! You saved Rs. ${result.discountAmount}`);
        } catch (error: any) {
            console.error('Coupon application error:', error);
            const message = error.response?.data?.error?.message || 'Invalid coupon code';
            toast.error(message);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        toast.success('Coupon removed');
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
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        name="fullName"
                                        value={shippingAddress.fullName}
                                        onChange={handleAddressChange}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        value={shippingAddress.phone}
                                        onChange={handleAddressChange}
                                        placeholder="Enter your phone number"
                                        className="w-full px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={shippingAddress.email}
                                        onChange={handleAddressChange}
                                        placeholder="Enter your email address"
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
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        id="city"
                                        type="text"
                                        name="city"
                                        value={shippingAddress.city}
                                        onChange={handleAddressChange}
                                        placeholder="Enter your city"
                                        className="w-full px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                    <input
                                        id="district"
                                        type="text"
                                        name="district"
                                        value={shippingAddress.district}
                                        onChange={handleAddressChange}
                                        placeholder="Enter your district"
                                        className="w-full px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                                    <input
                                        id="landmark"
                                        type="text"
                                        name="landmark"
                                        value={shippingAddress.landmark}
                                        onChange={handleAddressChange}
                                        placeholder="Enter a nearby landmark (optional)"
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

                    {/* Step 1.5: Coupon Code */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold flex items-center">
                                <Tag size={20} className="mr-3 text-emerald-600" />
                                Have a coupon?
                            </h2>
                        </div>

                        {appliedCoupon ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Check size={20} className="text-green-600 mr-2" />
                                        <div>
                                            <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                                            <p className="text-sm text-green-600">
                                                {appliedCoupon.discountType === 'percentage'
                                                    ? `${appliedCoupon.discountValue}% off`
                                                    : `Rs. ${appliedCoupon.discountValue} off`
                                                } - You saved Rs. {appliedCoupon.calculatedDiscount}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleRemoveCoupon}
                                        className="flex items-center gap-1"
                                    >
                                        <X size={16} />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="Enter coupon code"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleApplyCoupon();
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleApplyCoupon}
                                    loading={couponLoading}
                                    disabled={!couponCode.trim()}
                                >
                                    Apply
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
                            {appliedCoupon && (
                                <div className="flex justify-between text-green-600">
                                    <span>Coupon ({appliedCoupon.code})</span>
                                    <span>-Rs. {appliedCoupon.calculatedDiscount}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                                <span>Total</span>
                                <span>Rs. {getTotalWithDiscount()}</span>
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
