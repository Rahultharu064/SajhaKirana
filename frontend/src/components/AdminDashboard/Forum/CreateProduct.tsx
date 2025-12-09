import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../../services/productService";
import { getCategories } from "../../../services/categoryService";
import toast, { Toaster } from "react-hot-toast";
import Button from "../../ui/Button";

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please select at least one product image");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    setLoading(true);

    try {
      await createProduct({
        title,
        slug,
        description,
        price: Number(price),
        mrp: Number(mrp),
        stock: Number(stock),
        categoryId: Number(categoryId),
        sku,
        isActive,
        images,
      });

      toast.success("Product created successfully!");

      // Navigate to products page
      navigate('/admin/products');
    } catch (err: any) {
      console.error(err);
      const message = err?.response?.data?.error?.message || err?.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl font-semibold mb-4">Create Product</h2>
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
          <label htmlFor="isActive" className="font-medium">Active</label>
        </div>
        <div>
          <label htmlFor="images" className="block font-medium">Images</label>
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            title="Select multiple image files"
            onChange={handleImageChange}
            className="mt-1"
          />
        </div>
<Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
        >
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </div>
  );
};

export default CreateProduct;
