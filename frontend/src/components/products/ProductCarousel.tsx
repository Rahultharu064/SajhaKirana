import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';

interface ProductCarouselProps {
    title: string;
    subtitle?: string;
    products: any[];
    viewAllLink?: string;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
    title,
    subtitle,
    products,
    viewAllLink,
}) => {
    const navigate = useNavigate();

    const handleViewDetails = (slug: string) => {
        navigate(`/product/${slug}`);
    };
    return (
        <section className="py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
                {viewAllLink && (
                    <Link
                        to={viewAllLink}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                        View All
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onViewDetails={() => handleViewDetails(product.slug)}
                    />
                ))}
            </div>
        </section>
    );
};
