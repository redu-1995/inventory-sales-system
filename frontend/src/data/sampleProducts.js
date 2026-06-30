export const sampleProducts = [
  {
    id: 1,
    name: "Nivea Lotion 200ml",
    sku: "NIV-LOT-200",
    category: "Skincare", // Represents the Category ForeignKey name
    brand: "Nivea", 
    cost_price: 8.50,     
    selling_price: 13.00,  
    stock: 5,              
    status: true,        
    salesCount: 412,
    revenue: 5356.00,
    created_at: "2026-06-01T10:00:00Z", 
    updatedAt: "2 mins ago"
  },
  {
    id: 2,
    name: "Lux Soap Bar Pack",
    sku: "LUX-SOP-6PK",
    category: "Personal Care",
    brand: "Unilever",
    cost_price: 3.10,
    selling_price: 5.50,
    stock: 10,
    status: true,
    salesCount: 280,
    revenue: 1540.00,
    created_at: "2026-05-15T14:30:00Z",
    updatedAt: "1 hour ago"
  },
  {
    id: 3,
    name: "Colgate Toothpaste",
    sku: "COL-TP-150",
    category: "Oral Care",
    brand: "Colgate",
    cost_price: 2.20,
    selling_price: 4.25,
    stock: 8,
    status: true,
    salesCount: 340,
    revenue: 1445.00,
    created_at: "2026-06-10T09:15:00Z",
    updatedAt: "3 hours ago"
  },
  {
    id: 4,
    name: "Head & Shoulders 400ml",
    sku: "HS-SHM-400",
    category: "Haircare",
    brand: "P&G",
    cost_price: 6.00,
    selling_price: 9.99,
    stock: 45,
    status: true,
    salesCount: 410,
    revenue: 4095.90,
    created_at: "2026-04-20T11:00:00Z",
    updatedAt: "Yesterday"
  },
  {
    id: 5,
    name: "Dettol Hand Wash",
    sku: "DET-HW-250",
    category: "Hygiene",
    brand: "Reckitt",
    cost_price: 1.80,
    selling_price: 3.50,
    stock: 0,
    status: false,         // Out of stock maps to status = false
    salesCount: 95,
    revenue: 332.50,
    created_at: "2026-06-28T16:00:00Z",
    updatedAt: "2 days ago"
  }
];