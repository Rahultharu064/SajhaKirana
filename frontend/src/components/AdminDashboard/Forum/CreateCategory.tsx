import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { createCategory } from "../../../services/categoryService";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";

const CreateCategory: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCategory({
        name,
        slug,
        image: image || undefined,
      });

      toast.success("Category created successfully!");

      // Reset form
      setName("");
      setSlug("");
      setImage(null);

      navigate("/admin/create-product");
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
      <h2 className="text-2xl font-semibold mb-4">Create Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter category name"
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
            placeholder="Enter category slug"
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="image" className="block font-medium">Image</label>
          <input
            id="image"
            type="file"
            accept="image/*"
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
          {loading ? "Creating..." : "Create Category"}
        </Button>
      </form>
    </div>
  );
};

export default CreateCategory;
