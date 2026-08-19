import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import SalesStats from '../../components/sales/SalesStats';
import SalesFilters from '../../components/sales/SalesFilters';
import SalesTable from '../../components/sales/SalesTable';
import CreateSaleModal from '../../components/sales/SaleModal'; 
import ReceivePaymentModal from '../../components/sales/ReceivePaymentModal'; 
import ViewSaleModal from '../../components/sales/SaleDetailsModal'; 
import PrintInvoice from '../../components/sales/PrintInvoice'; 
import { useSales } from '../../hooks/useSales';
import api from '../../services/api';

const INITIAL_FILTERS = {
  search: '',
  status: 'All',
  paymentMethod: 'All',
  date: '',
};

const Sales = () => {
  const {
    sales,
    stats: backendStats,
    loading: isLoadingSales,
    fetchSales,
    fetchSalesReport,
    createSale,
    deleteSale,
    receivePayment,
    exportSales,
  } = useSales();

  // --- Modal Visibility & Active Data States ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPaymentSale, setSelectedPaymentSale] = useState(null); // For Receive Payment
  const [selectedViewSale, setSelectedViewSale] = useState(null);       // For View Sale Details
  const [selectedPrintSale, setSelectedPrintSale] = useState(null);     // For Print Invoice Modal
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Backend Dropdown Data States ---
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoadingModalData, setIsLoadingModalData] = useState(false);

  // --- Filters State ---
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Company details configuration (Passed to PrintInvoice)
  const companyInfo = {
    name: 'ABC COSMETICS PLC',
    address: 'Addis Ababa, Ethiopia',
    phone: '+251 911 000 000',
    email: 'info@abccosmetics.com',
    tin: '0012345678',
  };

  // --- Fetch Initial Sales & Stats ---
  useEffect(() => {
    fetchSales();
    fetchSalesReport();
  }, [fetchSales, fetchSalesReport]);

  // --- Fetch Dropdown Data for Creation Modal ---
  const fetchModalData = useCallback(async () => {
    try {
      setIsLoadingModalData(true);
      const [productsRes, customersRes] = await Promise.all([
        api.get('products/products/'),
        api.get('customers/customers/'),
      ]);

      const productsData = productsRes.data;
      const customersData = customersRes.data;

      setProducts(Array.isArray(productsData) ? productsData : productsData?.results || []);
      setCustomers(Array.isArray(customersData) ? customersData : customersData?.results || []);
    } catch (error) {
      console.error('Error fetching modal dropdown data:', error);
    } finally {
      setIsLoadingModalData(false);
    }
  }, []);

  // Fetch dropdown options when modal is opened
  const handleOpenCreateModal = () => {
    fetchModalData();
    setIsCreateModalOpen(true);
  };

  // --- ACTION HANDLERS ---

  // 1. 👁 ACTION: View Sale Details
  const handleViewSale = (sale) => {
    setSelectedViewSale(sale);
  };

  // 2. 💰 ACTION: Open Receive Payment Modal
  const handleOpenReceivePayment = (sale) => {
    setSelectedPaymentSale(sale);
  };

  // Submit Payment via Hook
  const handleReceivePaymentSubmit = async ({ saleId, amount, paymentMethod }) => {
    try {
      setIsSubmitting(true);
      await receivePayment({
        sale: saleId,
        amount: parseFloat(amount),
        payment_method: paymentMethod || 'Cash',
      });
      setSelectedPaymentSale(null);
    } catch (error) {
      console.error('Payment update failed:', error);
      alert(`Error recording payment: ${error.message || 'Payment processing failed.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. 🖨 ACTION: Print Invoice
  const handlePrintInvoice = (sale) => {
    setSelectedPrintSale(sale);
  };

  // 4. ➕ ACTION: Create Sale via Hook
  const handleCreateSale = async (payload) => {
    try {
      setIsSubmitting(true);
      await createSale(payload);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create sale:', error);
      alert(`Error creating sale: ${error.message || 'Operation failed.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. 🗑 ACTION: Delete Sale via Hook
  const handleDeleteSale = async (id) => {
    if (!window.confirm(`Are you sure you want to delete order #${id}?`)) return;
    try {
      await deleteSale(id);
    } catch (error) {
      console.error('Failed to delete sale:', error);
      alert(`Error deleting sale: ${error.message || 'Operation failed.'}`);
    }
  };

  // --- Client-Side Filter Logic ---
  const filteredSales = useMemo(() => {
    if (!sales || sales.length === 0) return [];

    return sales.filter((sale) => {
      const searchTerm = filters.search.toLowerCase().trim();
      const customerName =
        sale.customer_name || (typeof sale.customer === 'object' ? sale.customer?.full_name : '');

      const matchesSearch =
        !searchTerm ||
        sale.id?.toString().includes(searchTerm) ||
        customerName?.toLowerCase().includes(searchTerm);

      const matchesStatus =
        filters.status === 'All' ||
        sale.status?.toUpperCase() === filters.status.toUpperCase();

      const normalizeString = (str) => (str || '').toLowerCase().replace(/[\s_]+/g, '');
      const matchesPaymentMethod =
        filters.paymentMethod === 'All' ||
        normalizeString(sale.payment_method) === normalizeString(filters.paymentMethod);

      const formattedSaleDate = sale.sale_date ? sale.sale_date.split('T')[0] : '';
      const matchesDate = !filters.date || formattedSaleDate === filters.date;

      return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDate;
    });
  }, [sales, filters]);

  // --- CSV Export Logic ---
  const handleExportFilteredSales = useCallback(
    (filename = 'filtered_sales_report.csv') => {
      if (filters.search || filters.status !== 'All' || filters.paymentMethod !== 'All' || filters.date) {
        // Fallback to client-side CSV for filtered subset
        if (!filteredSales || filteredSales.length === 0) {
          alert('No sales data to export.');
          return;
        }

        const headers = ['Order ID', 'Customer', 'Date', 'Payment Method', 'Status', 'Total Amount'];
        const rows = filteredSales.map((sale) => {
          const customerName =
            sale.customer_name || (typeof sale.customer === 'object' ? sale.customer?.full_name : '') || 'N/A';
          return [
            sale.id,
            `"${customerName.replace(/"/g, '""')}"`,
            sale.sale_date ? sale.sale_date.split('T')[0] : '',
            `"${(sale.payment_method || '').replace(/"/g, '""')}"`,
            sale.status || '',
            sale.total_amount || 0,
          ];
        });

        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Direct backend blob export via hook when no custom filters are set
        exportSales(filename);
      }
    },
    [filters, filteredSales, exportSales]
  );

  // --- Calculated Stats Fallback ---
  const displayStats = useMemo(() => {
    if (backendStats) return backendStats;

    const totalOrders = sales.length;
    const totalRevenue = sales.reduce((acc, curr) => acc + (parseFloat(curr.total_amount) || 0), 0);
    const paidOrders = sales.filter((s) => s.status === 'PAID').length;
    const unpaidOrders = sales.filter((s) => s.status === 'UNPAID' || s.status === 'PARTIAL').length;

    return { totalOrders, totalRevenue, paidOrders, unpaidOrders };
  }, [backendStats, sales]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Orders</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage customer orders, track payments, and generate invoices.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Order</span>
        </button>
      </div>

      {/* Overview Statistics */}
      <SalesStats stats={displayStats} />

      {/* Filters */}
      <SalesFilters
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={() => setFilters(INITIAL_FILTERS)}
      />

      {/* Orders Table */}
      <SalesTable
        sales={filteredSales}
        loading={isLoadingSales}
        onViewSale={handleViewSale}
        onReceivePayment={handleOpenReceivePayment}
        onPrintInvoice={handlePrintInvoice}
        onExportSales={handleExportFilteredSales}
        onDeleteSale={handleDeleteSale}
      />

      {/* --- MODALS SECTION --- */}

      {/* 1. Create Sale Modal */}
      <CreateSaleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSale}
        availableProducts={products}
        availableCustomers={customers}
        isSubmitting={isSubmitting || isLoadingModalData}
      />

      {/* 2. Receive Payment Modal */}
      <ReceivePaymentModal
        isOpen={!!selectedPaymentSale}
        onClose={() => setSelectedPaymentSale(null)}
        sale={selectedPaymentSale}
        onSubmit={handleReceivePaymentSubmit}
      />

      {/* 3. View Sale Details Modal */}
      <ViewSaleModal
        isOpen={!!selectedViewSale}
        onClose={() => setSelectedViewSale(null)}
        sale={selectedViewSale}
      />

      {/* 4. Print Invoice Modal */}
      {selectedPrintSale && (
        <PrintInvoice
          sale={selectedPrintSale}
          companyInfo={companyInfo}
          onClose={() => setSelectedPrintSale(null)}
        />
      )}
    </div>
  );
};

export default Sales;