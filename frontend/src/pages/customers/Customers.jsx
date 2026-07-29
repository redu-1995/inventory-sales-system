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

  // Modals Local State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Modal Open Handlers
  const handleOpenAddModal = () => {
    setSelectedCustomer(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (customer) => {
    // Close details modal if editing from within the details view
    setIsDetailsModalOpen(false); 
    setSelectedCustomer(customer);
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  // Modal Close Handlers
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedCustomer(null);
  };

  // Form Submit Handler
  const handleFormSubmit = async (formData) => {
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, formData);
      } else {
        await createCustomer(formData);
      }
      handleCloseFormModal();
    } catch (err) {
      console.error('Failed to save customer:', err);
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
        customerToEdit={selectedCustomer}
      />

      {/* VIEW CUSTOMER DETAILS MODAL */}
      <CustomerDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        customer={selectedCustomer}
        onEdit={handleOpenEditModal}
      />
    </div>
  );
}