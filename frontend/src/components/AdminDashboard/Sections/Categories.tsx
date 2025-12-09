import React, { useState, useEffect } from "react";
import { getCategories, updateCategory, deleteCategory, type Category } from "../../../services/categoryService";
import Table from "../Layouts/Table";
import Modal from "../Layouts/Modal";
import Button from "../../ui/Button";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", slug: "", image: null as File | null });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError("Failed to load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setEditFormData({ name: category.name, slug: category.slug, image: null });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      await updateCategory(editingCategory.id, { ...editFormData, image: editFormData.image || undefined });
      setEditingCategory(null);
      await fetchCategories();
    } catch (err) {
      console.error("Failed to update category:", err);
      setError("Failed to update category");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
      setError("Failed to delete category");
    }
  };

  const tableData = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    image: cat.image ? 'Yes' : 'No',
    createdAt: new Date(cat.createdAt).toLocaleDateString(),
  }));

  const actions = (row: any) => (
    <div className="flex gap-2">
      <Button variant="primary" onClick={() => handleEdit(categories.find(c => c.id === row.id)!)}>
        Edit
      </Button>
      <Button variant="danger" onClick={() => handleDelete(row.id)}>
        Delete
      </Button>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      <Table
        columns={['name', 'slug', 'image', 'createdAt']}
        data={tableData}
        actions={actions}
      />

      <Modal
        open={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title="Edit Category"
      >
        <form onSubmit={handleEditSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              value={editFormData.name}
              onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Enter category name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Slug</label>
            <input
              type="text"
              value={editFormData.slug}
              onChange={(e) => setEditFormData({...editFormData, slug: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Enter category slug"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditFormData({...editFormData, image: e.target.files?.[0] || null})}
              className="w-full p-2 border rounded"
              title="Upload category image"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary">Update</Button>
            <Button type="button" variant="secondary" onClick={() => setEditingCategory(null)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
