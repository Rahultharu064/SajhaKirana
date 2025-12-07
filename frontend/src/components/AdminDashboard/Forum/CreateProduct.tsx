import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { createProduct } from "../../../services/productService";
import toast, { Toaster } from "react-hot-toast";

interface CreateProductFormProps {
  categories: { id: number; name: string }[];
}

const CreateProduct: React.FC<CreateProductFormProps> = ({ categories }) => {
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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

      // Reset form
      setTitle("");
      setSlug("");
      setDescription("");
      setPrice("");
      setMrp("");
      setStock("");
      setCategoryId("");
      setSku("");
      setImages([]);
      setIsActive(true);
    } catch (err: any) {
      const message = err?.response?.data?.error?.message || "Something went wrong";
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
          <label htmlFor="category" className="block font-medium">Category</label>
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
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
