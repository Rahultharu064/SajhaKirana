import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct, getProductById } from "../../../services/productService";
import { getCategories } from "../../../services/categoryService";
import toast, { Toaster } from "react-hot-toast";
import Button from "../../ui/Button";

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [mrp, setMrp] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [sku, setSku] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        // Fetch Categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        // Fetch Product Details
        if (id) {
          const response = await getProductById(Number(id));
          const product = response.data.data;

          setTitle(product.title);
          setSlug(product.slug);
          setDescription(product.description || "");
          setPrice(product.price);
          setMrp(product.mrp);
          setStock(product.stock);
          setCategoryId(product.categoryId);
          setSku(product.sku);
          setIsActive(product.isActive);
          // Assuming product.images is an array of strings (urls)
          if (Array.isArray(product.images)) {
            setCurrentImages(product.images);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error("Failed to load product details");
        navigate('/admin/products');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

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
        sku,
        isActive,
        images: images.length > 0 ? images : undefined, // Only send images if new ones are selected
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

  if (fetching) {
    return <div className="p-6 text-center">Loading product data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex items-center gap-4 mb-6">
<Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/products')}
          className="rounded-full"
          title="Back to Products"
          startIcon={<ArrowLeft size={20} />}
        />
        <h2 className="text-2xl font-semibold">Edit Product</h2>
      </div>

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
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              placeholder="Enter price"
              className="mt-1 w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="mrp" className="block font-medium">MRP</label>
            <input
              id="mrp"
              type="number"
              value={mrp}
              onChange={(e) => setMrp(Number(e.target.value))}
              required
              placeholder="Enter MRP"
              className="mt-1 w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="stock" className="block font-medium">Stock</label>
            <input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
              placeholder="Enter stock quantity"
              className="mt-1 w-full border rounded p-2"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="category" className="block font-medium">Category</label>
<Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => navigate('/admin/categories')}
              title="Add new category"
              startIcon={<Plus size={18} />}
            />
          </div>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
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
            onChange={(e) => setSku(e.target.value)}
            placeholder="Enter SKU"
            required
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="isActive" className="font-medium">Active (Visible in store)</label>
        </div>

        <div>
          <label htmlFor="images" className="block font-medium">Images</label>
          <div className="mb-2">
            <span className="text-sm text-gray-500">Current images: {currentImages.length} </span>
            {currentImages.length > 0 && <span className="text-xs text-gray-400">(Upload new images to replace existing ones)</span>}
          </div>
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            title="Select multiple image files"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
<Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
<Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
