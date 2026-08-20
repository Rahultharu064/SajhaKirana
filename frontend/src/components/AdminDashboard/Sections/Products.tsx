import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Table from '../Layouts/Table';
import AdminProductCard from '../Forum/AdminProductCard';
import { Edit, Trash, Grid, List, RefreshCw, Plus, PackageX, AlertTriangle } from 'lucide-react';
import { getAllProducts, deleteProduct } from '../../../services/productService';

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      const productsData = response.data.data || response.data;
      setProducts(productsData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
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

  const handleEdit = (productId: number) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(productId);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
      toast.error('Failed to delete product');
    }
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
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${viewMode === 'table'
                ? 'bg-white dark:bg-slate-700 shadow text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <List size={16} />
              Table
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${viewMode === 'card'
                ? 'bg-white dark:bg-slate-700 shadow text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Grid size={16} />
              Card
            </button>
          </div>
          <button
            onClick={() => navigate('/admin/create-product')}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 text-sm font-semibold shadow-sm shadow-emerald-600/20 transition-colors"
          >
            <Plus size={16} />
            Create Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-4 text-rose-500">
            <AlertTriangle size={28} />
          </div>
          <p className="text-slate-900 dark:text-white font-semibold mb-1">Couldn't load products</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 text-sm font-semibold transition-colors"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <Table
          columns={['Name', 'SKU', 'Price', 'MRP', 'Stock', 'Category', 'Status']}
          data={tableData}
          actions={(row: any) => (
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(row.id)}
                type="button"
                aria-label="Edit"
                className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                type="button"
                aria-label="Delete"
                className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 transition-colors"
              >
                <Trash size={16} />
              </button>
            </div>
          )}
        />
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <PackageX size={28} />
          </div>
          <p className="text-slate-900 dark:text-white font-semibold mb-1">No products found</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Create your first product to get started</p>
          <button
            onClick={() => navigate('/admin/create-product')}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 text-sm font-semibold transition-colors"
          >
            <Plus size={16} />
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
