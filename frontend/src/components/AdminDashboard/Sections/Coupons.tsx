import React, { useState, useEffect } from 'react';
import Table from '../Layouts/Table';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import type { Coupon, CreateCouponData, UpdateCouponData, CouponFilters, PaginatedCoupons } from '../../../services/couponService';
import { createCoupon, getAllCoupons, updateCoupon, deleteCoupon } from '../../../services/couponService';
import toast from 'react-hot-toast';
import { Edit, Trash, Plus, Search } from 'lucide-react';

interface CouponFormProps {
  coupon?: Coupon | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

function CouponForm({ coupon, onSubmit, onCancel, loading }: CouponFormProps) {
  const [formData, setFormData] = useState<CreateCouponData | UpdateCouponData>({
    code: coupon?.code || '',
    description: coupon?.description || '',
    discountType: coupon?.discountType || 'fixed',
    discountValue: coupon?.discountValue || 0,
    minOrderValue: coupon?.minOrderValue || 0,
    maxDiscount: coupon?.maxDiscount || undefined,
    usageLimit: coupon?.usageLimit || 0,
    expiryDate: coupon ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
    isActive: coupon?.isActive !== undefined ? coupon.isActive : true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 uppercase"
            placeholder="SUMMER2024"
            required
          />
        </div>
        <div>
          <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
          <select
            id="discountType"
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="fixed">Fixed Amount</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-1">
            Discount Value {formData.discountType === 'percentage' ? '(%)' : '(Rs.)'}
          </label>
          <input
            id="discountValue"
            type="number"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleChange}
            min="0"
            step={formData.discountType === 'percentage' ? "1" : "0.01"}
            max={formData.discountType === 'percentage' ? "100" : undefined}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            placeholder={formData.discountType === 'percentage' ? "10" : "10.00"}
            title="Enter the discount value for the coupon"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Value (Rs.)</label>
          <input
            type="number"
            name="minOrderValue"
            value={formData.minOrderValue}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="0.00"
            title="Minimum order value required to use the coupon"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formData.discountType === 'percentage' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (Rs.)</label>
            <input
              type="number"
              name="maxDiscount"
              value={formData.maxDiscount || ''}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0.00"
              title="Maximum discount amount for percentage coupons"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
          <input
            type="number"
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="0"
            title="Maximum number of times this coupon can be used"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Enter coupon description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            title="Date when the coupon expires"
            required
          />
        </div>
        <div className="flex items-center">
          <input
            id="isActive"
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            title="Set coupon status as active or inactive"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Active</label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {coupon ? 'Update' : 'Create'} Coupon
        </Button>
      </div>
    </form>
  );
}

function Coupons() {
  const [coupons, setCoupons] = useState<PaginatedCoupons | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [filters, setFilters] = useState<CouponFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await getAllCoupons(filters);
      setCoupons(data);
    } catch (error: any) {
      console.error('Error loading coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, [filters]);

  const handleCreateCoupon = async (data: CreateCouponData) => {
    try {
      await createCoupon(data);
      toast.success('Coupon created successfully');
      setModalOpen(false);
      loadCoupons();
    } catch (error: any) {
      console.error('Error creating coupon:', error);
      const message = error.response?.data?.error?.message || 'Failed to create coupon';
      toast.error(message);
    }
  };

  const handleUpdateCoupon = async (data: UpdateCouponData) => {
    if (!editingCoupon) return;

    try {
      await updateCoupon(editingCoupon.id, data);
      toast.success('Coupon updated successfully');
      setModalOpen(false);
      setEditingCoupon(null);
      loadCoupons();
    } catch (error: any) {
      console.error('Error updating coupon:', error);
      const message = error.response?.data?.error?.message || 'Failed to update coupon';
      toast.error(message);
    }
  };

  const handleDeleteCoupon = async (coupon: Coupon) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) return;

    try {
      await deleteCoupon(coupon.id);
      toast.success('Coupon deleted successfully');
      loadCoupons();
    } catch (error: any) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    }
  };

  const formatDiscount = (coupon: Coupon) => {
    return coupon.discountType === 'percentage'
      ? `${coupon.discountValue}%`
      : `Rs. ${coupon.discountValue}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTableData = () => {
    if (!coupons) return [];

    return coupons.data.map((coupon) => ({
      code: coupon.code,
      discount: formatDiscount(coupon),
      description: coupon.description,
      minOrder: `Rs. ${coupon.minOrderValue}`,
      usage: `${coupon.usageCount}/${coupon.usageLimit || '∞'}`,
      expiry: formatDate(coupon.expiryDate),
      status: coupon.isActive ? 'Active' : 'Inactive',
      actions: coupon,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coupons</h1>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus size={16} />
          Create Coupon
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by code or description"
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              title="Filter coupons by status"
              value={filters.isActive === undefined ? '' : filters.isActive.toString()}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                isActive: e.target.value === '' ? undefined : e.target.value === 'true',
                page: 1
              }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
            <select
              title="Sort coupons by selected field"
              value={filters.sortBy || 'createdAt'}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="createdAt">Created Date</option>
              <option value="code">Code</option>
              <option value="expiryDate">Expiry Date</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order</label>
            <select
              title="Sort order for coupon list"
              value={filters.sortOrder || 'desc'}
              onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc', page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <>
            <Table
              columns={['Code', 'Discount', 'Description', 'Min Order', 'Usage', 'Expiry', 'Status']}
              data={getTableData()}
              actions={(row) => {
                const coupon = row.actions as Coupon;
                return (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCoupon(coupon);
                        setModalOpen(true);
                      }}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(coupon)}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                      title="Delete"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                );
              }}
            />

            {/* Pagination */}
            {coupons && coupons.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {(coupons.pagination.page - 1) * coupons.pagination.limit + 1} to{' '}
                  {Math.min(coupons.pagination.page * coupons.pagination.limit, coupons.pagination.total)} of{' '}
                  {coupons.pagination.total} results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={coupons.pagination.page <= 1}
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page! - 1 }))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={coupons.pagination.page >= coupons.pagination.totalPages}
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page! + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCoupon(null);
        }}
        title={editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
      >
        <CouponForm
          coupon={editingCoupon}
          onSubmit={editingCoupon ? handleUpdateCoupon : handleCreateCoupon}
          onCancel={() => {
            setModalOpen(false);
            setEditingCoupon(null);
          }}
          loading={loading}
        />
      </Modal>
    </div>
  );
}

export default Coupons;
