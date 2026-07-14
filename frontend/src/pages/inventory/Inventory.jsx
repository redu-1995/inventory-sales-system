import React, { useCallback, useEffect, useState } from 'react';
import {
  Calendar,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  SlidersHorizontal,
  Upload
} from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import { productAPI } from '../../services/productService';

import InventoryStats from '../../components/inventory/InventoryStats';
import InventoryFilters from '../../components/inventory/InventoryFilters';
import InventoryTable from '../../components/inventory/InventoryTable';
import InventoryValueCard from '../../components/inventory/InventoryValueCard';
import InventoryStatusChart from '../../components/inventory/InventoryStatusChart';
import LowStockPanel from '../../components/inventory/LowStockPanel';
import RecommendedRestocking from '../../components/inventory/RecommendedRestocking';
import Pagination from '../../components/inventory/Pagination';

import StockInModal from '../../components/inventory/StockInModal';
import StockOutModal from '../../components/inventory/StockOutModal';
import StockAdjustmentModal from '../../components/inventory/StockAdjustmentModal';
import CreatePurchaseRequestModal from '../../components/inventory/CreatePurchaseRequestModal';

const getInventoryStatus = (item) => {
  if (item.quantity === 0) return 'OUT_OF_STOCK';
  if (item.quantity <= (item.reorder_level ?? item.minimum_stock_level ?? 0)) return 'LOW_STOCK';
  return 'IN_STOCK';
};

export default function Inventory() {
  const [inventoryList, setInventoryList] = useState([]);
  const [summaryMetrics, setSummaryMetrics] = useState({
    total_stock_units: 0,
    low_stock: 0,
    out_of_stock: 0,
    inventory_value: 0
  });
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockInProducts, setStockInProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stockInOptionsLoading, setStockInOptionsLoading] = useState(false);
  const [stockOutItems, setStockOutItems] = useState([]);
  const [stockOutOptionsLoading, setStockOutOptionsLoading] = useState(false);

  const loadStockInOptions = async () => {
    setStockInOptionsLoading(true);
    try {
      const [productsData, suppliersData] = await Promise.all([
        productAPI.getProducts(),
        productAPI.getSuppliers()
      ]);

      setStockInProducts(productsData.results || productsData || []);
      setSuppliers(suppliersData.results || suppliersData || []);
    } catch (err) {
      console.error('Unable to load stock-in options:', err);
      setError('Unable to load products and suppliers for stock in. Please try again.');
    } finally {
      setStockInOptionsLoading(false);
    }
  };

  const openStockInModal = () => {
    setActiveModal('STOCK_IN');
    loadStockInOptions();
  };

  const openStockOutModal = async () => {
    setActiveModal('STOCK_OUT');
    setStockOutOptionsLoading(true);
    try {
      const inventoryData = await inventoryService.getInventory({ page_size: 1000 });
      setStockOutItems(inventoryData.results || inventoryData || []);
    } catch (err) {
      console.error('Unable to load stock-out options:', err);
      setError('Unable to load inventory for stock out. Please try again.');
    } finally {
      setStockOutOptionsLoading(false);
    }
  };

  const fetchInventoryData = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        page,
        search: search || undefined,
        category: category || undefined,
        status: status || undefined
      };

      const [inventoryData, summaryData, lowStockData] = await Promise.all([
        inventoryService.getInventory(filters),
        inventoryService.getInventorySummary(),
        inventoryService.getLowStock()
      ]);

      if (inventoryData) {
        const items = inventoryData.results || inventoryData;
        setInventoryList(items);
        setCategories(
          Array.from(new Set((items || []).map((item) => item.category_name || item.product?.category?.name).filter(Boolean))).sort()
        );
        setStatusOptions(
          Array.from(new Set((items || []).map((item) => getInventoryStatus(item)).filter(Boolean))).map((value) => ({
            value,
            label: value === 'OUT_OF_STOCK' ? 'Out of Stock' : value === 'LOW_STOCK' ? 'Low Stock' : 'In Stock'
          }))
        );

        if (inventoryData.count) {
          setTotalPages(Math.ceil(inventoryData.count / 10));
        }
      }

      if (summaryData) setSummaryMetrics(summaryData);
      if (lowStockData) setLowStockAlerts(lowStockData.results || lowStockData);
      setError(null);
    } catch (err) {
      console.error('Unable to load inventory data:', err);
      setError('Unable to refresh inventory data. Check the API connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [category, page, search, status]);

  useEffect(() => {
    fetchInventoryData();
  }, [fetchInventoryData]);

  const handleStockInSubmit = async (payload) => {
    await inventoryService.stockIn(payload);
    fetchInventoryData();
  };

  const handleStockOutSubmit = async (payload) => {
    await inventoryService.stockOut(payload);
    fetchInventoryData();
  };

 const handleAdjustmentSubmit = async (payload) => {
  try {
    setError(null);
    await inventoryService.adjustStock(payload); // Single parameter pass-through
    setActiveModal(null);                       // Automatically dismiss modal on success
    setSelectedItem(null);                      // Clean up selected memory
    fetchInventoryData();                       // Refresh master listings
  } catch (err) {
    console.error('Adjustment failed:', err);
    setError(err.response?.data?.message || 'Failed to complete physical audit adjustment.');
  }
};

  const handleCreatePurchaseSubmit = async (payload) => {
    console.log('Purchase request payload:', payload);
    return Promise.resolve();
  };

  const openAdjustmentModal = (item) => {
    setSelectedItem(item);
    setActiveModal('ADJUST');
  };
  const handleExport = async (format) => {
  try {
    setExporting(true);
    setExportOpen(false); // Instantly close the dropdown menu for a clean UX
    
    // Call our service (which handles raw binary response conversions into physical downloads)
    await inventoryService.exportData(format);
  } catch (err) {
    console.error(`Error exporting to ${format.toUpperCase()}:`, err);
    alert(`Failed to compile and download ${format.toUpperCase()} report.`);
  } finally {
    setExporting(false);
  }
};

  const actionButtonClass = 'h-10 inline-flex items-center justify-center gap-2 px-4 rounded-md text-sm font-bold text-white shadow-sm transition-colors';

  return (
    <div className="min-h-screen bg-slate-50 p-5 lg:p-7 space-y-5 font-sans">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">Inventory Management</h1>
          <p className="text-sm text-slate-600 mt-2">Monitor stock levels, inventory movements, and restocking activities.</p>
        </div>

        <div className="flex flex-col items-stretch lg:items-end gap-4">
          <div className="flex flex-wrap items-center gap-3">

            <span className="text-sm text-slate-600">
              Last updated: 2 minutes ago <span className="ml-1 inline-block w-2 h-2 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
            <button 
            type="button" // CRITICAL: Stops any parent form from processing a layout reset
            onClick={openStockInModal}
            className={`${actionButtonClass} bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium`}
          >
            <Upload size={16} />
            Stock In
          </button>
                        
                          <button onClick={openStockOutModal} className={`${actionButtonClass} bg-red-600 hover:bg-red-700`}>
              <Download size={16} />
              Stock Out
            </button>
                <button 
            type="button"
            onClick={() => {
              console.log('--- DIAGNOSTIC: Adjustment Button Clicked ---');
              console.log('Current activeModal state before change:', activeModal);
              console.log('Setting activeModal to: "ADJUST"');
              
              setActiveModal('ADJUST');
              setSelectedItem(null);
              
              if (typeof loadStockInOptions === 'function') {
                console.log('Triggering loadStockInOptions()...');
                loadStockInOptions();
              } else {
                console.warn('WARNING: loadStockInOptions function is not defined in this scope!');
              }
            }}
            className={`${actionButtonClass} bg-orange-500 hover:bg-orange-600`}
          >
            <SlidersHorizontal size={16} />
            Inventory Adjustment
          </button>
             <div className="relative">
                <button 
                  onClick={() => !exporting && setExportOpen((open) => !open)} 
                  disabled={exporting}
                  className={`${actionButtonClass} bg-blue-700 hover:bg-blue-800 disabled:opacity-50 inline-flex items-center gap-2`}
                >
                  <FileText size={16} />
                  {exporting ? 'Exporting...' : 'Export'}
                  <ChevronDown size={14} />
                </button>
                
                {exportOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-44 rounded-md border border-slate-200 bg-white shadow-lg py-2">
                    <button 
                      type="button"
                      onClick={() => handleExport('pdf')}
                      className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <FileText size={15} className="text-red-600" />
                      Export PDF
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => handleExport('excel')}
                      className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <FileSpreadsheet size={15} className="text-emerald-600" />
                      Export Excel
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => handleExport('csv')}
                      className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <FileText size={15} className="text-blue-600" />
                      Export CSV
                    </button>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <InventoryStats summary={summaryMetrics} />

      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-4">
        <div className="2xl:col-span-2">
          <InventoryStatusChart summary={summaryMetrics} />
        </div>

        <div className="2xl:col-span-7 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <InventoryFilters
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              status={status}
              setStatus={setStatus}
              categories={categories}
              statuses={statusOptions}
            />
          </div>

          {loading ? (
            <div className="py-20 text-center text-sm font-medium text-slate-500 space-y-3">
              <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Loading inventory records...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <InventoryTable data={inventoryList} onAdjustClick={openAdjustmentModal} />
              </div>
              <div className="px-4 pb-4">
                <Pagination page={page} setPage={setPage} totalPages={totalPages} />
              </div>
            </>
          )}
        </div>

        <div className="2xl:col-span-3 space-y-4">
          <LowStockPanel lowStockProducts={lowStockAlerts} onCreatePurchaseClick={() => setActiveModal('PURCHASE')} />
          <RecommendedRestocking lowStock={lowStockAlerts} onReorderTrigger={() => setActiveModal('PURCHASE')} />
        </div>
      </div>

      <InventoryValueCard totalValuation={summaryMetrics?.inventory_value} />

      {activeModal === 'STOCK_IN' && (
        <StockInModal
          products={stockInProducts}
          suppliers={suppliers}
          optionsLoading={stockInOptionsLoading}
          onSubmit={handleStockInSubmit}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'STOCK_OUT' && (
        <StockOutModal
          inventoryItems={stockOutItems}
          optionsLoading={stockOutOptionsLoading}
          onSubmit={handleStockOutSubmit}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'PURCHASE' && (
        <CreatePurchaseRequestModal onSubmit={handleCreatePurchaseSubmit} onClose={() => setActiveModal(null)} />
      )}
       {activeModal === 'ADJUST' && (
  <StockAdjustmentModal 
    item={selectedItem} 
    // Safeguard: Fallback to an empty array if products aren't fetched yet
    products={stockInProducts || []} 
    onSubmit={async (payload) => {
      try {
        const completePayload = {
          ...payload,
          inventory_id: selectedItem ? selectedItem.id : payload.inventory_id
        };
        await inventoryService.adjustStock(completePayload); 
        setActiveModal(null);
        setSelectedItem(null);
        fetchInventoryData(); 
      } catch (err) {
        console.error(err);
      }
    }}
    onClose={() => {
      setActiveModal(null);
      setSelectedItem(null);
    }} 
  />
)}
    </div>
  );
}
