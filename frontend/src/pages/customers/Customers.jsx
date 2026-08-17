import React, { useState } from 'react';
import CustomerHeader from '../../components/customer/CustomerHeader';
import CustomerStats from '../../components/customer/CustomerStats';
import CustomerFilters from '../../components/customer/CustomerFilters';
import CustomerTable from '../../components/customer/CustomerTable';
import { useCustomers } from '../../hooks/useCustomers';
import CustomerModal from '../../components/customer/CustomerModal';
import CustomerDetailsModal from '../../components/customer/CustomerDetailsModal';

export default function Customers() {
  const {
    customers,
    stats,
    loading,
    error,
    totalCount,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    ordering,
    setOrdering,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    exportCustomers,
    resetFilters,
    refreshCustomers,
  } = useCustomers();

  // ✅ Separate state for Add/Edit Form and Details/View Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [customerToView, setCustomerToView] = useState(null);

  // 1. Open Add Form
  const handleOpenAddModal = () => {
    setCustomerToEdit(null); // null means "Add New"
    setIsFormModalOpen(true);
  };

  // 2. Open Edit Form
  const handleOpenEditModal = (customer) => {
    setIsDetailsModalOpen(false); // Close details modal if open
    setCustomerToView(null);
    setCustomerToEdit(customer);   // Set customer specifically for editing
    setIsFormModalOpen(true);
  };

  // 3. Open View Details
  const handleOpenViewModal = (customer) => {
    setCustomerToView(customer);
    setIsDetailsModalOpen(true);
  };

  // Modal Close Handlers
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setCustomerToEdit(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setCustomerToView(null);
  };

  // Form Submit Handler
  const handleFormSubmit = async (formData) => {
    const id = customerToEdit?.id || customerToEdit?.customer_id || customerToEdit?._id;
    if (id) {
      await updateCustomer(id, formData);
    } else {
      await createCustomer(formData);
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 bg-slate-50 min-h-screen">
      <CustomerHeader 
        onAddCustomer={handleOpenAddModal} 
        onExport={exportCustomers} 
      />

      <CustomerStats stats={stats} loading={loading} />

      <CustomerFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        ordering={ordering}
        setOrdering={setOrdering}
        resetFilters={resetFilters}
      />

      <CustomerTable
        customers={customers}
        loading={loading}
        error={error}
        totalCount={totalCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onViewCustomer={handleOpenViewModal}
        onEditCustomer={handleOpenEditModal}
        onDeleteCustomer={(id, name) => {
          if (window.confirm(`Are you sure you want to delete customer ${name}?`)) {
            deleteCustomer(id);
          }
        }}
        onRefresh={refreshCustomers}
      />

      {/* ADD / EDIT FORM MODAL */}
      <CustomerModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        customerToEdit={customerToEdit}
      />

      {/* VIEW CUSTOMER DETAILS MODAL */}
      <CustomerDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        customer={customerToView}
        onEdit={handleOpenEditModal}
      />
    </div>
  );
}