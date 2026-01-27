import { useState, useEffect } from 'react';
import Table from '../Layouts/Table';
import { Search, Filter, AlertTriangle, CheckCircle, XCircle, Save, RotateCcw } from 'lucide-react';
import { getAllProducts, updateProductStock } from '../../../services/productService';
import toast from 'react-hot-toast';
import Button from '../../ui/Button';

interface Product {
  id: number;
  title: string;
  sku: string;
  stock: number;
  price: number;
  category: { name: string };
  isActive: boolean;
  slug: string;
}

function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'out'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStockValue, setEditStockValue] = useState<number>(0);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      // Fetch all products (pagination can be added later)
      const response = await getAllProducts({ limit: 100 });
      if (response.data && response.data.data) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load inventory", error);
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockUpdate = async (id: number) => {
    try {
      await updateProductStock(id, editStockValue);
      toast.success("Stock updated successfully");
      setEditingId(null);

      // Update local state
      setProducts(products.map(p =>
        p.id === id ? { ...p, stock: editStockValue } : p
      ));
    } catch (error) {
      console.error("Failed to update stock", error);
      toast.error("Failed to update stock");
    }
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditStockValue(product.stock);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'low') return product.stock > 0 && product.stock <= 10;
    if (statusFilter === 'out') return product.stock === 0;

    return true;
  });

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50', icon: XCircle };
    if (stock <= 10) return { label: 'Low Stock', color: 'text-amber-600 bg-amber-50', icon: AlertTriangle };
    return { label: 'In Stock', color: 'text-green-600 bg-green-50', icon: CheckCircle };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500">Track and manage product stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchInventory} className="flex items-center gap-2">
            <RotateCcw size={16} /> Refresh
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="text-gray-400 h-4 w-4" />
          <label htmlFor="statusFilter">Filter by stock status:</label>
          <select
            id="statusFilter"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="low">Low Stock (≤ 10)</option>
            <option value="out">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <Table
            columns={['Product Info', 'SKU', 'Category', 'Stock Level', 'Status', 'Actions']}
            data={filteredProducts}
            actions={(row: Product) => (
              <div className="flex items-center gap-2">
                {editingId === row.id ? (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                    <label htmlFor={`editStock-${row.id}`}>Edit Stock:</label>
                    <input
                      id={`editStock-${row.id}`}
                      type="number"
                      className="w-20 px-2 py-1 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-100"
                      value={editStockValue}
                      onChange={(e) => setEditStockValue(parseInt(e.target.value) || 0)}
                      min="0"
                    />
                    <button
                      onClick={() => handleStockUpdate(row.id)}
                      className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                      title="Save"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                      title="Cancel"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(row)}
                    className="h-8 text-xs font-medium"
                  >
                    Update Stock
                  </Button>
                )}
              </div>
            )}
          // Custom cell rendering is not supported by the basic Table component based on previous usage, 
          // so we map data to a simpler format for the `data` prop, OR we assume Table can handle the object if we don't strictly type-check inside Table.
          // However, based on `AdminDashboard/Sections/Orders.tsx`, `Table` takes `columns` and `data` and `actions`.
          // We might need to map the data to match columns exactly or modify Table. 
          // Let's look at how Table is implemented or used. In Orders.tsx, it mapped data. 
          // So let's map data here too for the display values.
          />

          {/* Since the reusable Table component might assume direct mapping, let's look at `Orders.tsx` approach again. 
                It creates a `tableData` array. Let's do that.
            */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product.stock);
                  const StatusIcon = status.icon;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{product.title}</td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{product.sku}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                          {product.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{product.stock}</td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit text-xs font-medium ${status.color}`}>
                          <StatusIcon size={12} />
                          {status.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end">
                          {editingId === product.id ? (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                                <label htmlFor={`editStock-${product.id}`}>Edit Stock:</label>
                              <input
                                id={`editStock-${product.id}`}
                                type="number"
                                className="w-20 px-2 py-1 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100 text-right"
                                value={editStockValue}
                                onChange={(e) => setEditStockValue(parseInt(e.target.value) || 0)}
                                min="0"
                                autoFocus
                              />
                              <button
                                onClick={() => handleStockUpdate(product.id)}
                                className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                                title="Save"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                title="Cancel"
                              >
                                <RotateCcw size={16} />
                              </button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditing(product)}
                              className="h-8 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                            >
                              Update Stock
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No products found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
