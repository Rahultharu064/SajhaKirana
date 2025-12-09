import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../Layouts/Table';
import AdminProductCard from '../Forum/AdminProductCard';
import { Edit, Trash, Grid, List } from 'lucide-react';
import { getAllProducts } from '../../../services/productService';

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      setLoading(true);
      const response = await getAllProducts();
      console.log('API Response:', response);
      const productsData = response.data.data || response.data;
      console.log('Products data:', productsData);
      setProducts(productsData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      console.error('Error details:', err.response?.data, err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Refresh data when component mounts (useful when coming back from create page)
  useEffect(() => {
    const handleFocus = () => {
      fetchProducts();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleEdit = (productId: number) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  const handleDelete = (productId: number) => {
    // TODO: Implement delete functionality
    console.log('Delete product:', productId);
  };

  const tableData = products.map((product: any) => ({
    id: product.id,
    Name: product.title,
    SKU: product.sku,
    Price: `Rs. ${product.price}`,
    MRP: `Rs. ${product.mrp}`,
    Stock: product.stock,
    Category: product.category?.name || 'No Category',
    Status: product.isActive ? 'Active' : 'Inactive',
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchProducts}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
          >
            Refresh
          </button>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-3 py-1 rounded ${
                viewMode === 'table'
                  ? 'bg-white shadow text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List size={16} />
              Table
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-2 px-3 py-1 rounded ${
                viewMode === 'card'
                  ? 'bg-white shadow text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid size={16} />
              Card
            </button>
          </div>
          <button
            onClick={() => navigate('/admin/create-product')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Product
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <Table
          columns={['Name', 'SKU', 'Price', 'MRP', 'Stock', 'Category', 'Status']}
          data={tableData}
          actions={(row: any) => (
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(row.id)}
                type="button"
                aria-label="Edit"
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                type="button"
                aria-label="Delete"
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
              >
                <Trash size={16} />
              </button>
            </div>
          )}
        />
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Grid size={48} className="mx-auto mb-4" />
            <p className="text-lg">No products found</p>
            <p className="text-sm">Create your first product to get started</p>
          </div>
          <button
            onClick={() => navigate('/admin/create-product')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <AdminProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
