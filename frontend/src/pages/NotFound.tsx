import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
            <div className="absolute flex flex-col items-center">
                <div className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</div>
                <p className="text-gray-600 mb-8 text-center max-w-md">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link
                    to="/"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                >
                    Go to Homepage
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
