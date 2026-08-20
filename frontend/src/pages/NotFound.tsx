import { Link } from 'react-router-dom';
import { Package, Home, ShoppingBag } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-100/40 rounded-full blur-[100px] -z-10" />

            <Link to="/" className="flex items-center gap-3 mb-10">
                <div className="bg-brand-gradient p-2.5 rounded-2xl shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tight bg-brand-gradient bg-clip-text text-transparent">
                    SajhaKirana
                </span>
            </Link>

            <h1 className="text-8xl sm:text-9xl font-black text-gradient leading-none">404</h1>
            <div className="flex flex-col items-center mt-4 text-center">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">Aisle Not Found</h2>
                <p className="text-slate-500 font-medium mb-10 max-w-md">
                    The page you're looking for might have been moved, renamed, or is out of stock. Let's get you back on track.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link to="/" className="btn-premium px-8 py-3.5 gap-2">
                        <Home size={18} />
                        Back to Home
                    </Link>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-slate-700 bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 transition-colors shadow-sm"
                    >
                        <ShoppingBag size={18} />
                        Browse Products
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
