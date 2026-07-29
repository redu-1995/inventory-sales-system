import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, Loader2 } from 'lucide-react';

/**
 * CustomerModal Component
 * Form modal used for both creating and editing customer records.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Handler to close modal
 * @param {Function} props.onSubmit - Promise function (createCustomer or updateCustomer)
 * @param {Object|null} props.customerToEdit - Initial customer data if in edit mode
 */
export default function CustomerModal({
  isOpen,
  onClose,
  onSubmit,
  customerToEdit = null,
}) {
  const isEditMode = Boolean(customerToEdit);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    status: 'ACTIVE',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form data when editing or reset when opening fresh
  useEffect(() => {
    if (customerToEdit) {
      setFormData({
        full_name: customerToEdit.full_name || customerToEdit.name || '',
        phone: customerToEdit.phone || '',
        email: customerToEdit.email || '',
        address: customerToEdit.address || '',
        status: customerToEdit.status || 'ACTIVE',
      });
    } else {
      setFormData({
        full_name: '',
        phone: '',
        email: '',
        address: '',
        status: 'ACTIVE',
      });
    }
    setErrors({});
  }, [customerToEdit, isOpen]);

  if (!isOpen) return null;

  // Form Field Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field on edit
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Basic Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save customer:', err);
      // Handle Django backend field validation errors (e.g. { phone: ["Already exists"] })
      if (typeof err === 'object' && err !== null) {
        setErrors(err);
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      {/* Modal Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isEditMode ? 'Edit Customer' : 'Add New Customer'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? 'Update existing customer details.'
                : 'Fill in the information to register a new customer.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* General Error Banner */}
        {errors.general && (
          <div className="mx-5 mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
            {errors.general}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Abebe Bikila"
                className={`w-full pl-9 pr-3 py-2 bg-slate-50 border ${
                  errors.full_name ? 'border-red-500' : 'border-slate-200'
                } rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
              />
            </div>
            {errors.full_name && (
              <span className="text-xs text-red-500 mt-1 block">
                {Array.isArray(errors.full_name) ? errors.full_name[0] : errors.full_name}
              </span>
            )}
          </div>

          {/* Phone & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+251 911 000000"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50 border ${
                    errors.phone ? 'border-red-500' : 'border-slate-200'
                  } rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                />
              </div>
              {errors.phone && (
                <span className="text-xs text-red-500 mt-1 block">
                  {Array.isArray(errors.phone) ? errors.phone[0] : errors.phone}
                </span>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="customer@example.com"
                className={`w-full pl-9 pr-3 py-2 bg-slate-50 border ${
                  errors.email ? 'border-red-500' : 'border-slate-200'
                } rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-red-500 mt-1 block">
                {Array.isArray(errors.email) ? errors.email[0] : errors.email}
              </span>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. Bole Sub-city, Addis Ababa"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer / Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditMode ? 'Save Changes' : 'Create Customer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}