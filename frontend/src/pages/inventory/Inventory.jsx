import React, { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventoryService';

// Layout & Analytical Data Presenters
import InventoryStats from '../../components/inventory/InventoryStats';
import InventoryFilters from '../../components/inventory/InventoryFilters';
import InventoryTable from '../../components/inventory/InventoryTable';
import InventoryValueCard from '../../components/inventory/InventoryValueCard';
import InventoryStatusChart from '../../components/inventory/InventoryStatusChart';
import LowStockPanel from '../../components/inventory/LowStockPanel';
import RecommendedRestocking from '../../components/inventory/RecommendedRestocking';
import Pagination from '../../components/inventory/Pagination';

// Workflow State Modification Overlays
import StockInModal from '../../components/inventory/StockInModal';
import StockOutModal from '../../components/inventory/StockOutModal';
import StockAdjustmentModal from '../../components/inventory/StockAdjustmentModal';
import CreatePurchaseRequestModal from '../../components/inventory/CreatePurchaseRequestModal';

export default function Inventory() {
  // --- Core Reactive Data States ---
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

  // --- Search, Filter & Pagination States ---
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- Modal Visibility & Targeted Selection States ---
  const [activeModal, setActiveModal] = useState(null); // 'STOCK_IN' | 'STOCK_OUT' | 'PURCHASE' | 'ADJUST' | null
  const [selectedItem, setSelectedItem] = useState(null);

  // --- Lifecycle Hook: Query Matrix Synchronizer ---
  useEffect(() => {
    fetchInventoryData();
  }, [search, category, status, page]);

  // Combined parallel API invocation dispatcher
  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      // Build filters according to Django backend validation architecture
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

      // Map incoming payload array values safely to components
      if (inventoryData) {
        setInventoryList(inventoryData.results || inventoryData);
        if (inventoryData.count) {
          setTotalPages(Math.ceil(inventoryData.count / 10)); // Assuming default backend limit size = 10
        }
      }
      if (summaryData) setSummaryMetrics(summaryData);
      if (lowStockData) setLowStockAlerts(lowStockData);
      
      setError(null);
    } catch (err) {
      console.error("Data pipeline synchronization failure:", err);
      setError("Unable to sync view states with the server database. Verify gateway runtime links.");
    } finally {
      setLoading(false);
    }
  };

  // --- Operation Workflow Handlers ---
  const handleStockInSubmit = async (payload) => {
    await inventoryService.stockIn(payload);
    fetchInventoryData(); // Re-trigger reactive fetch cycle to cascade metric updates
  };

  const handleStockOutSubmit = async (payload) => {
    await inventoryService.stockOut(payload);
    fetchInventoryData();
  };

  const handleAdjustmentSubmit = async (id, payload) => {
    await inventoryService.adjustStock(id, payload);
    fetchInventoryData();
  };

  const handleCreatePurchaseSubmit = async (payload) => {
    // Intended hook location for your separate procurement/supplier service layer
    console.log("Mocking purchase order payload pipeline initialization:", payload);
    return Promise.resolve();
  };

  const openAdjustmentModal = (item) => {
    setSelectedItem(item);
    setActiveModal('ADJUST');
  };

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-6 font-sans">
      
      {/* 1. View Header Actions Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Master Inventory Operations</h1>
          <p className="text-xs text-slate-500 mt-0.5">Control live tracking, parameters reconciliation, and stock buffers.</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button 
            onClick={() => setActiveModal('STOCK_IN')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            📥 Log Stock In
          </button>
          <button 
            onClick={() => setActiveModal('STOCK_OUT')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            📤 Log Stock Out
          </button>
          <button 
            onClick={() => setActiveModal('PURCHASE')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            📝 Procure Reorder
          </button>
        </div>
      </div>

      {/* 2. Global Error Indicators Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* 3. Primary Analytical Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* KPI Analytics Cards */}
          <InventoryStats summary={summaryMetrics} />

          {/* Filtering Engine & Live Main Data Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <InventoryFilters 
              search={search} setSearch={setSearch}
              category={category} setCategory={setCategory}
              status={status} setStatus={setStatus}
            />
            
            {loading ? (
              <div className="py-20 text-center text-xs font-medium text-slate-400 space-y-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"/>
                <p>Streaming master node ledger records...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-slate-100">
                  <InventoryTable data={inventoryList} onAdjustClick={openAdjustmentModal} />
                </div>
                <Pagination page={page} setPage={setPage} totalPages={totalPages} />
              </>
            )}
          </div>
        </div>

        {/* Side-Dock Widgets Panel Column */}
        <div className="space-y-6">
          {/* Working Capital Component Card */}
          <InventoryValueCard 
            totalValuation={summaryMetrics?.inventory_value} 
            outOfStockCount={summaryMetrics?.out_of_stock}
          />

          {/* Spread Visualization Chart Block */}
          <InventoryStatusChart summary={summaryMetrics} />

          {/* Critical Risk Alert Blocks */}
          <LowStockPanel 
            lowStockProducts={lowStockAlerts} 
            onCreatePurchaseClick={() => setActiveModal('PURCHASE')}
          />

          {/* Automated Reorder Wizard Metrics */}
          <RecommendedRestocking lowStock={lowStockAlerts} />
        </div>
      </div>

      {/* --- Dynamic Workflow Modal Render Switches --- */}
      {activeModal === 'STOCK_IN' && (
        <StockInModal onSubmit={handleStockInSubmit} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'STOCK_OUT' && (
        <StockOutModal onSubmit={handleStockOutSubmit} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'PURCHASE' && (
        <CreatePurchaseRequestModal onSubmit={handleCreatePurchaseSubmit} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'ADJUST' && selectedItem && (
        <StockAdjustmentModal 
          item={selectedItem} 
          onSubmit={handleAdjustmentSubmit} 
          onClose={() => { setActiveModal(null); setSelectedItem(null); }} 
        />
      )}
    </div>
  );
}