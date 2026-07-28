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

const INITIAL_FILTERS = {
  search: '',
  status: 'All',
  paymentMethod: 'All',
  date: '',
};

const Sales = () => {
  const { deleteSale } = useSales();

  // --- Modal Visibility & Active Data States ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPaymentSale, setSelectedPaymentSale] = useState(null); // For Receive Payment
  const [selectedViewSale, setSelectedViewSale] = useState(null);       // For View Sale Details
  const [selectedPrintSale, setSelectedPrintSale] = useState(null);     // 👈 2. State for Print Invoice Modal
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Backend Data States ---
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoadingSales, setIsLoadingSales] = useState(false);
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

  // Utility to build Auth Headers
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }, []);

  // --- Fetch Sales List ---
  const fetchSales = useCallback(async () => {
    try {
      setIsLoadingSales(true);
      const res = await fetch('http://127.0.0.1:8000/api/sales/sales/', {
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        setSales(Array.isArray(data) ? data : data.results || []);
      } else {
        console.error('Failed to fetch sales list:', res.status);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setIsLoadingSales(false);
    }
  }, [getAuthHeaders]);

  // --- Fetch Dropdown Data ---
  const fetchModalData = useCallback(async () => {
    try {
      setIsLoadingModalData(true);
      const headers = getAuthHeaders();

      const [productsRes, customersRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/products/products/', { headers }),
        fetch('http://127.0.0.1:8000/api/customers/', { headers }),
      ]);

      if (productsRes.ok && customersRes.ok) {
        const productsData = await productsRes.json();
        const customersData = await customersRes.json();

        setProducts(Array.isArray(productsData) ? productsData : productsData.results || []);
        setCustomers(Array.isArray(customersData) ? customersData : customersData.results || []);
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    } finally {
      setIsLoadingModalData(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchSales();
    fetchModalData();
  }, [fetchSales, fetchModalData]);

  // --- ACTION HANDLERS ---

  // 1. 👁 ACTION: View Sale Details
  const handleViewSale = (sale) => {
    setSelectedViewSale(sale);
  };

  // 2. 💰 ACTION: Open Receive Payment Modal
  const handleOpenReceivePayment = (sale) => {
    setSelectedPaymentSale(sale);
  };

  // Submit Payment to Backend
  const handleReceivePaymentSubmit = async ({ saleId, amount, paymentMethod }) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('http://127.0.0.1:8000/api/sales/payments/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          sale: saleId,
          amount: parseFloat(amount),
          payment_method: paymentMethod || 'Cash',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record payment');
      }

      await fetchSales();
      setSelectedPaymentSale(null);
    } catch (error) {
      console.error('Payment update failed:', error);
      alert(`Error recording payment: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. 🖨 ACTION: Print Invoice (👈 3. Updated Handler to open modal)
  const handlePrintInvoice = (sale) => {
    setSelectedPrintSale(sale);
  };

  // --- Create Order Submission ---
  const handleCreateSale = async (payload) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('http://127.0.0.1:8000/api/sales/sales/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to record sale order');

      await fetchSales();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create sale:', error);
      alert(`Error creating sale: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Client-Side Filter Logic ---
  const filteredSales = useMemo(() => {
    if (!sales || sales.length === 0) return [];

    return sales.filter((sale) => {
      const searchTerm = filters.search.toLowerCase().trim();
      const customerName = sale.customer_name || (typeof sale.customer === 'object' ? sale.customer?.full_name : '');
      
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
      const matchesDate =
        !filters.date ||
        formattedSaleDate === filters.date;

      return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDate;
    });
  }, [sales, filters]);

  // --- CSV Export Logic ---
  const handleExportFilteredSales = useCallback((filename = 'filtered_sales_report.csv') => {
    if (!filteredSales || filteredSales.length === 0) {
      alert('No sales data to export.');
      return;
    }

    const headers = ['Order ID', 'Customer', 'Date', 'Payment Method', 'Status', 'Total Amount'];
    const rows = filteredSales.map((sale) => {
      const customerName = sale.customer_name || (typeof sale.customer === 'object' ? sale.customer?.full_name : '') || 'N/A';
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
  }, [filteredSales]);

  // --- Stats Calculation ---
  const stats = useMemo(() => {
    const totalOrders = sales.length;
    const totalRevenue = sales.reduce((acc, curr) => acc + (parseFloat(curr.total_amount) || 0), 0);
    const paidOrders = sales.filter((s) => s.status === 'PAID').length;
    const unpaidOrders = sales.filter((s) => s.status === 'UNPAID' || s.status === 'PARTIAL').length;

    return { totalOrders, totalRevenue, paidOrders, unpaidOrders };
  }, [sales]);

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
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Order</span>
        </button>
      </div>

      {/* Overview Statistics */}
      <SalesStats stats={stats} />

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
        onDeleteSale={deleteSale}
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

      {/* 4. Print Invoice Modal (👈 4. Added Print Invoice Modal render) */}
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