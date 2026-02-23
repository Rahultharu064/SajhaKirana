import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { RootState } from '../../Redux/store';
import PaymentMethod from '../../components/Publicwebsite/Checkout/PaymentMethod';
import { orderService } from '../../services/orderService';
import { applyCoupon } from '../../services/couponService';
import type { CouponWithDiscount } from '../../services/couponService';
import { getDistricts } from '../../services/districtService';
import toast from 'react-hot-toast';
import { Tag, X, Check, Search, ChevronDown, MapPin, CreditCard, ShieldCheck, ArrowRight, Package, Truck, Lock } from 'lucide-react';
import Header from '../../components/Publicwebsite/Layouts/Header';
import Footer from '../../components/Publicwebsite/Layouts/Footer';

const Checkout = () => {
    const navigate = useNavigate();
    const { items, total } = useSelector((state: RootState) => state.cart);
    const { user } = useSelector((state: RootState) => state.auth);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [districts, setDistricts] = useState<string[]>([]);
    const [districtsLoading, setDistrictsLoading] = useState(true);

    const [districtSearch, setDistrictSearch] = useState('');
    const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isDropdownItemClicked, setIsDropdownItemClicked] = useState(false);

    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        district: '',
        landmark: '',
    });

    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'esewa' | 'khalti'>('cod');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<CouponWithDiscount | null>(null);
    const [couponLoading, setCouponLoading] = useState(false);

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const response = await getDistricts();
                if (response.data.success) {
                    setDistricts(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch districts:', error);
                toast.error('Failed to load districts');
            } finally {
                setDistrictsLoading(false);
            }
        };
        fetchDistricts();
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=/checkout');
            return;
        }
        if (items.length === 0) {
            navigate('/cart');
            return;
        }
        if (user) {
            setShippingAddress(prev => ({
                ...prev,
                email: user.email || '',
                fullName: user.name || '',
                phone: user.phone || ''
            }));
        }

        if (shippingAddress.district && !districtSearch) {
            setDistrictSearch(shippingAddress.district);
        }
    }, [user, items, navigate, shippingAddress.district]);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const filteredDistricts = districts.filter(district =>
        district.toLowerCase().includes(districtSearch.toLowerCase())
    );

    const handleDistrictSelect = (district: string) => {
        setShippingAddress(prev => ({ ...prev, district }));
        setDistrictSearch(district);
        setIsDistrictDropdownOpen(false);
        setHighlightedIndex(-1);
    };

    const handleDistrictInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDistrictSearch(value);
        setHighlightedIndex(-1);
        if (!isDistrictDropdownOpen) {
            setIsDistrictDropdownOpen(true);
        }
    };

    const handleDistrictInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isDistrictDropdownOpen) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => Math.min(prev + 1, filteredDistricts.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0 && highlightedIndex < filteredDistricts.length) {
                handleDistrictSelect(filteredDistricts[highlightedIndex]);
            }
        } else if (e.key === 'Escape') {
            setIsDistrictDropdownOpen(false);
            setHighlightedIndex(-1);
        }
    };

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
            toast.success(`Coupon applied! Selection value transformed.`);
        } catch (error: any) {
            const message = error.response?.data?.error?.message || 'Invalid coupon code';
            toast.error(message);
        } finally {
            setCouponLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!user) return;
        try {
            setLoading(true);
            if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.district) {
                toast.error('Please complete all mandatory address fields');
                setStep(1);
                setLoading(false);
                return;
            }

            const orderDetails = {
                total: getTotalWithDiscount(),
                items: items.map(item => ({
                    sku: item.sku,
                    qty: item.quantity,
                    price: item.price
                })),
                shippingAddress,
                paymentMethod
            };

            const deviceFingerprint = `${navigator.userAgent}-${window.screen.width}x${window.screen.height}`;
            toast.loading('Synchronizing secure transaction...', { id: 'fraud-check' });

            const fraudResponse = await orderService.validateFraud({
                userId: user.userId,
                orderDetails,
                deviceFingerprint
            });

            toast.dismiss('fraud-check');

            if (fraudResponse.data.success) {
                const { riskLevel } = fraudResponse.data.data;
                if (riskLevel === 'high') {
                    toast.error(`Transaction Declined: Security threshold not met.`, { duration: 6000 });
                    setLoading(false);
                    return;
                }
            }

            const payload = {
                userId: user.userId,
                ...orderDetails
            };

            const response = await orderService.createOrder(payload);
            const { data } = response.data;

            if (response.data.success) {
                if (paymentMethod === 'cod') {
                    toast.success('Masterpiece secured successfully!');
                    navigate(`/payment/success?order=${data.orderId}`);
                } else if (paymentMethod === 'esewa') {
                    const esewaData = data.data;
                    if (esewaData && esewaData.esewaConfig) {
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
                    }
                } else if (paymentMethod === 'khalti') {
                    const khaltiData = data.data;
                    if (khaltiData && khaltiData.paymentUrl) {
                        window.location.href = khaltiData.paymentUrl;
                    }
                }
            }
        } catch (error: any) {
            const msg = error.response?.data?.error?.message || 'Transaction could not be completed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            <Header />

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[120px] -z-10" />
            <div className="absolute top-[30%] left-0 w-[600px] h-[600px] bg-sky-100/30 rounded-full blur-[100px] -z-10" />

            <div className="container-custom py-16">
                <div className="mb-12">
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6"
                    >
                        <Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link>
                        <ArrowRight size={10} />
                        <Link to="/cart" className="hover:text-emerald-500 transition-colors">Selection</Link>
                        <ArrowRight size={10} />
                        <span className="text-slate-900">Secure Checkout</span>
                    </motion.nav>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                        Secure <br />
                        <span className="text-gradient">Selection</span>
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Forms Column */}
                    <div className="flex-1 space-y-10">
                        {/* Step 1: Delivery Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass rounded-[3rem] p-10 border-white/50 shadow-2xl relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl transition-all ${step === 1 ? 'bg-brand-gradient text-white shadow-lg' : 'bg-emerald-50 text-emerald-500'
                                        }`}>
                                        <MapPin size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Delivery Details</h2>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Point of Destination</p>
                                    </div>
                                </div>
                                {step === 2 && (
                                    <button onClick={() => setStep(1)} className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline">Revise Details</button>
                                )}
                            </div>

                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all ${step === 2 ? 'opacity-30 pointer-events-none blur-[2px]' : ''}`}>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Identity</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={shippingAddress.fullName}
                                        onChange={handleAddressChange}
                                        placeholder="Full Name"
                                        className="w-full h-16 px-8 rounded-2xl bg-white border-2 border-slate-100 focus:border-emerald-500/30 focus:outline-none font-bold text-slate-900 transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Protocol Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={shippingAddress.phone}
                                        onChange={handleAddressChange}
                                        placeholder="Mobile Number"
                                        className="w-full h-16 px-8 rounded-2xl bg-white border-2 border-slate-100 focus:border-emerald-500/30 focus:outline-none font-bold text-slate-900 transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Secure Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingAddress.email}
                                        onChange={handleAddressChange}
                                        placeholder="Email Address"
                                        className="w-full h-16 px-8 rounded-2xl bg-white border-2 border-slate-100 focus:border-emerald-500/30 focus:outline-none font-bold text-slate-900 transition-all shadow-sm"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Physical Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={shippingAddress.address}
                                        onChange={handleAddressChange}
                                        placeholder="District, Street Name, House No."
                                        className="w-full h-16 px-8 rounded-2xl bg-white border-2 border-slate-100 focus:border-emerald-500/30 focus:outline-none font-bold text-slate-900 transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">City / Area</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingAddress.city}
                                        onChange={handleAddressChange}
                                        placeholder="City"
                                        className="w-full h-16 px-8 rounded-2xl bg-white border-2 border-slate-100 focus:border-emerald-500/30 focus:outline-none font-bold text-slate-900 transition-all shadow-sm"
                                    />
                                </div>
                                <div className="relative space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Province District</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={districtSearch || shippingAddress.district || ''}
                                            onChange={handleDistrictInputChange}
                                            onKeyDown={handleDistrictInputKeyDown}
                                            onFocus={() => setIsDistrictDropdownOpen(true)}
                                            onBlur={() => setTimeout(() => setIsDistrictDropdownOpen(false), 200)}
                                            placeholder={districtsLoading ? "Loading Matrix..." : "Select District"}
                                            className="w-full h-16 px-8 pr-12 rounded-2xl bg-white border-2 border-slate-100 focus:border-emerald-500/30 focus:outline-none font-bold text-slate-900 transition-all shadow-sm"
                                            autoComplete="off"
                                        />
                                        <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                    </div>
                                    <AnimatePresence>
                                        {isDistrictDropdownOpen && filteredDistricts.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
                                            >
                                                {filteredDistricts.map((district, idx) => (
                                                    <div
                                                        key={district}
                                                        onClick={() => handleDistrictSelect(district)}
                                                        className={`px-8 py-4 cursor-pointer font-bold text-sm transition-colors ${idx === highlightedIndex ? 'bg-emerald-50 text-emerald-600' : 'text-slate-700 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        {district}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Notable Landmark (Optional)</label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={shippingAddress.landmark}
                                        onChange={handleAddressChange}
                                        placeholder="Nearby Monument, Hospital OR School"
                                        className="w-full h-16 px-8 rounded-2xl bg-white border-2 border-slate-100 focus:border-emerald-500/30 focus:outline-none font-bold text-slate-900 transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {step === 1 && (
                                <div className="mt-12 flex justify-end">
                                    <button
                                        onClick={() => {
                                            if (shippingAddress.fullName && shippingAddress.phone && shippingAddress.address && shippingAddress.city && shippingAddress.district) {
                                                setStep(2);
                                            } else {
                                                toast.error('Matrix incomplete. All mandatory fields required.');
                                            }
                                        }}
                                        className="btn-premium px-12 py-5 flex items-center gap-3"
                                    >
                                        PROCEED TO TRANSACTION
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        {/* Step 2: Payment Protocol */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass rounded-[3rem] p-10 border-white/50 shadow-2xl"
                            >
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-14 h-14 rounded-2xl bg-brand-gradient text-white flex items-center justify-center font-black text-2xl shadow-lg">
                                        <CreditCard size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Payment Protocol</h2>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Encrypted Transaction Gateways</p>
                                    </div>
                                </div>

                                <PaymentMethod
                                    selectedMethod={paymentMethod}
                                    onSelect={setPaymentMethod}
                                />

                                <div className="mt-10 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-start gap-4">
                                    <Lock size={20} className="text-emerald-500 mt-1" />
                                    <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-widest">
                                        Your transaction is secured with 256-bit encryption. Payment details are handled by authorized gateways and never stored on our servers.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Summary Sidebar */}
                    <aside className="lg:w-[450px] flex-shrink-0">
                        <div className="sticky top-24 space-y-8">
                            {/* Order Summary */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass rounded-[3rem] p-10 border-white/50 shadow-2xl bg-white"
                            >
                                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 mb-8 border-b border-slate-100 pb-4">Order Manifest</h3>

                                <div className="space-y-6 max-h-[300px] overflow-y-auto mb-10 pr-4 custom-scrollbar">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-6 group">
                                            <div className="w-16 h-16 bg-slate-50 rounded-xl p-2 flex-shrink-0 border border-slate-100 group-hover:bg-white transition-colors">
                                                <img src={item.image || 'https://placehold.co/100x100?text=Item'} className="w-full h-full object-contain" alt={item.sku} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight line-clamp-1">{item.sku}</h4>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Quantity: <span className="text-emerald-500">{item.quantity}</span></p>
                                            </div>
                                            <p className="text-sm font-black text-slate-900">Rs. {item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Coupon Section */}
                                <div className="mb-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    {appliedCoupon ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                                    <Check size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900 uppercase">{appliedCoupon.code}</p>
                                                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">- Rs. {appliedCoupon.calculatedDiscount}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setAppliedCoupon(null)}
                                                title="Remove Coupon"
                                                aria-label="Remove Coupon"
                                                className="text-rose-500 hover:text-rose-700 transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder="Coupon Matrix"
                                                className="flex-1 h-12 px-6 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 text-xs font-black transition-all"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading || !couponCode}
                                                className="h-12 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-30"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-100 mb-10">
                                    <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span className="text-slate-900">Rs. {total}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between items-center text-xs font-black text-emerald-600 uppercase tracking-widest">
                                            <span>Promotion Value</span>
                                            <span>- Rs. {appliedCoupon.calculatedDiscount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest">
                                        <span>Carbon Delivery</span>
                                        <span className="text-emerald-600">FREE</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-4 border-t-2 border-double border-slate-100">
                                        <span className="text-lg font-black text-slate-900 uppercase tracking-widest">Net Value</span>
                                        <span className="text-4xl font-black text-gradient leading-none">Rs. {getTotalWithDiscount()}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {step === 2 && (
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={loading}
                                            className="btn-premium w-full py-6 text-lg flex items-center justify-center gap-4 group disabled:opacity-50"
                                        >
                                            {loading ? 'SYNCHRONIZING...' : 'AUTHORIZE ORDER'}
                                            <ShieldCheck size={24} className="group-hover:scale-110 transition-transform" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => navigate('/cart')}
                                        className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] hover:text-slate-900 transition-colors"
                                    >
                                        Return to Selection
                                    </button>
                                </div>
                            </motion.div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass p-6 rounded-[2rem] text-center space-y-3">
                                    <Package size={24} className="mx-auto text-emerald-500" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Premium Packaging</p>
                                </div>
                                <div className="glass p-6 rounded-[2rem] text-center space-y-3">
                                    <Truck size={24} className="mx-auto text-emerald-500" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Express Delivery</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Checkout;
