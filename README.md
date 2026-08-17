# Inventory & Sales Management System

A web-based Inventory & Sales Management System designed to help businesses manage products, inventory, customers, sales, purchase orders, and business reports from a centralized dashboard.

The system is built with a React + Vite frontend and a Django REST Framework backend, with Ethiopian Birr (ETB) as the default currency.

## Features

### Dashboard
- Business overview and KPI cards
- Today's sales and revenue
- Inventory value
- Total products and customers
- Low-stock alerts
- Recent transactions
- Sales analytics and charts

### Product Management
- Create and manage products
- Product categories
- Product suppliers
- Product pricing
- Product stock information
- Product search and filtering
- Archive products instead of permanently deleting them
- View active and archived products

### Inventory Management
- Monitor current stock levels
- Track low-stock products
- Track out-of-stock products
- Configure reorder levels
- Record stock movements
- Stock-in, stock-out, and inventory adjustments
- Inventory valuation

### Sales Management
- Create sales transactions
- Add multiple products to a sale
- Customer selection
- Invoice numbers
- Payment methods
- Paid, partial, and unpaid sales
- Tax and discount handling
- Automatic sale total calculation
- Payment tracking
- Remaining balance calculation

### Customer Management
- Create and update customers
- Customer contact information
- Active/inactive customer status
- Customer search and filtering
- Preserve customer history associated with previous sales

### Purchase Orders
- Create purchase orders
- Manage suppliers
- Add products and quantities
- Track purchase order totals
- Pending, received, and cancelled statuses
- Expected delivery dates
- Purchase order history

### Notifications
- Inventory-related notifications
- Low-stock notifications
- System notifications
- Unread notification count
- Notification list and status

### Reports
The system provides reports for:

- Sales
- Inventory
- Customers
- Purchase orders

Reports can be exported for business use, including Excel/CSV formats where supported.

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router
- Lucide React
- ESLint/Oxlint

### Backend

- Python
- Django
- Django REST Framework
- PostgreSQL/SQLite for development
- Django ORM
- JWT authentication

### Development Tools

- Git
- GitHub
- VS Code
- Postman
- Docker (optional)

## Project Structure

```text
inventory-sales-system/
│
├── backend/
│   ├── backend/
│   ├── core/
│   ├── dashboard/
│   ├── customers/
│   ├── inventory/
│   ├── notifications/
│   ├── products/
│   ├── purchase_orders/
│   ├── reports/
│   ├── sales/
│   ├── users/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
└── README.md