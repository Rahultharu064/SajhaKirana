import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../../../services/productService";
import { getCategories } from "../../../services/categoryService";
import toast, { Toaster } from "react-hot-toast";

interface ProductData {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  stock: number;
  categoryId: number;
  sku: string;
  isActive: boolean;
  images: string[];
  category: { id: number; name: string };
}

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Form state - all strings for controlled inputs
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sku, setSku] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<File[]>([]);

  // Fetch categories and product data on mount
  useEffect(() => {
    const fetchData = async () => {
      setFetchLoading(true);
      try {
        if (!id || isNaN(Number(id))) {
          throw new Error('Invalid product ID');
        }

        const [categoriesData, productData] = await Promise.all([
          getCategories(),
          getProductById(Number(id))
        ]);

        setCategories(categoriesData);
        const product: ProductData = productData.data;

        // Populate form with existing product data
        setTitle(product.title || "");
        setSlug(product.slug || "");
        setDescription(product.description || "");
        setPrice(product.price ? product.price.toString() : "");
        setMrp(product.mrp ? product.mrp.toString() : "");
        setStock(product.stock ? product.stock.toString() : "");
        setCategoryId(product.categoryId ? product.categoryId.toString() : "");
        setSku(product.sku || "");
        setIsActive(product.isActive !== undefined ? product.isActive : true);
        setExistingImages(Array.isArray(product.images) ? product.images : []);
      } catch (error: any) {
        console.error('Failed to fetch data:', error);
        console.error('Error details:', error?.response?.data || error.message);
        const errorMessage = error?.response?.data?.error?.message ||
                           error?.response?.data?.message ||
                           error.message ||
                           "Failed to load product data";
        toast.error(errorMessage);
        navigate('/admin/products');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, navigate]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProduct(Number(id), {
        title,
        slug,
        description,
        price: Number(price),
        mrp: Number(mrp),
        stock: Number(stock),
        categoryId: Number(categoryId),
        // Note: SKU is readonly and not updated in current backend implementation
        isActive,
        images: images.length > 0 ? images : undefined,
      });

      toast.success("Product updated successfully!");
      navigate('/admin/products');
    } catch (err: any) {
      const message = err?.response?.data?.error?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter product title"
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="slug" className="block font-medium">Slug</label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="Enter product slug"
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter product description"
            className="mt-1 w-full border rounded p-2"
            rows={4}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className="block font-medium">Price</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="Enter price"
              step="0.01"
              min="0"
              className="mt-1 w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="mrp" className="block font-medium">MRP</label>
            <input
              id="mrp"
              type="number"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              required
              placeholder="Enter MRP"
              step="0.01"
              min="0"
              className="mt-1 w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="stock" className="block font-medium">Stock</label>
            <input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              placeholder="Enter stock quantity"
              min="0"
              className="mt-1 w-full border rounded p-2"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="category" className="block font-medium">Category</label>
            <button
              type="button"
              onClick={() => navigate('/admin/categories')}
              className="p-1 rounded hover:bg-gray-100"
              title="Add new category"
            >
              <Plus size={18} />
            </button>
          </div>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="mt-1 w-full border rounded p-2"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">SKU</label>
          <input
            id="sku"
            type="text"
            value={sku}
            readOnly
            className="mt-1 w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
            title="SKU cannot be modified"
          />
          <p className="text-sm text-gray-500 mt-1">SKU is read-only and cannot be changed.</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="isActive" className="font-medium">Active</label>
        </div>
        <div>
          <label className="block font-medium">Current Images</label>
          {existingImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {existingImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={"http://localhost:3000" + image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-1">No images uploaded yet.</p>
          )}
        </div>
        <div>
          <label htmlFor="images" className="block font-medium">
            Replace Images (optional - current images will be kept if not changed)
          </label>
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            title="Select multiple image files"
            onChange={handleImageChange}
            className="mt-1"
          />
          {images.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Selected {images.length} new image(s). Current images will be replaced.
            </p>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
