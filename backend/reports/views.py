import pandas as pd
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .services import ReportService
from .serializers import (
    DashboardSummarySerializer,
    SalesReportSerializer,
    PurchaseReportSerializer,
    InventoryReportSerializer,
    CustomerReportSerializer,
    TopProductSerializer,
    LowStockSerializer,
    RecentTransactionSerializer,
    ChartDataSerializer
)
from .utils import generate_csv_response, generate_excel_response


class ReportViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    # ---------------- Standard API Actions ----------------

    @action(detail=False, methods=['get'], url_path='dashboard-summary')
    def dashboard_summary(self, request):
        data = ReportService.get_dashboard_summary()
        serializer = DashboardSummarySerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='sales')
    def sales_report(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        customer_id = request.query_params.get('customer')
        payment_status = request.query_params.get('payment_status')

        data = ReportService.get_sales_report(start_date, end_date, customer_id, payment_status)
        serializer = SalesReportSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='purchases')
    def purchase_report(self, request):
        supplier_id = request.query_params.get('supplier')
        po_status = request.query_params.get('status')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        data = ReportService.get_purchase_report(supplier_id, po_status, start_date, end_date)
        serializer = PurchaseReportSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='inventory')
    def inventory_report(self, request):
        data = ReportService.get_inventory_report()
        serializer = InventoryReportSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='customers')
    def customer_report(self, request):
        data = ReportService.get_customer_report()
        serializer = CustomerReportSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='top-products')
    def top_products(self, request):
        data = ReportService.get_top_products()
        serializer = TopProductSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='low-stock')
    def low_stock(self, request):
        data = ReportService.get_low_stock_report()
        serializer = LowStockSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='recent-transactions')
    def recent_transactions(self, request):
        data = ReportService.get_recent_transactions()
        serializer = RecentTransactionSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='sales-chart')
    def sales_chart(self, request):
        data = ReportService.get_sales_chart_data()
        serializer = ChartDataSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ---------------- Export Endpoints (Mapped via as_view in urls.py) ----------------

class ExportViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def customers(self, request):
        export_format = request.query_params.get('file_format', 'csv')
        status = request.query_params.get('status')
        
        customer_data = ReportService.get_customer_export_rows()
        
        # Filter by status if provided
        if status:
            customer_data = [c for c in customer_data if c.get('Status') == status]
        
        df = pd.DataFrame(customer_data)
        
        headers = [
            'Customer ID',
            'Customer Name',
            'Phone',
            'Email',
            'Address',
            'Status',
            'Total Orders',
            'Total Purchase Amount',
            'Amount Paid',
            'Outstanding Balance',
            'Last Purchase Date',
            'Created Date',
        ]
        
        if export_format == 'excel':
            return generate_excel_response('customers_report', {'Customer Summary': df[headers] if not df.empty else df})
        
        data_rows = [
            [
                row.get('Customer ID'),
                row.get('Customer Name'),
                row.get('Phone'),
                row.get('Email'),
                row.get('Address'),
                row.get('Status'),
                row.get('Total Orders'),
                row.get('Total Purchase Amount'),
                row.get('Amount Paid'),
                row.get('Outstanding Balance'),
                row.get('Last Purchase Date'),
                row.get('Created Date'),
            ]
            for row in customer_data
        ]
        return generate_csv_response('customers_report', headers, data_rows)

    def sales(self, request):
        export_format = request.query_params.get('file_format', 'csv')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        customer_id = request.query_params.get('customer')
        payment_status = request.query_params.get('payment_status')

        sales_data = ReportService.get_sales_export_rows(start_date, end_date, customer_id, payment_status)
        df = pd.DataFrame(sales_data)

        headers = [
            'Invoice Number',
            'Sale Date',
            'Customer',
            'Subtotal',
            'Discount',
            'Tax',
            'Total Amount',
            'Amount Paid',
            'Balance Due',
            'Payment Status',
            'Payment Method',
            'Created By',
        ]

        if export_format == 'excel':
            return generate_excel_response('sales_report', {'Sales Summary': df[headers]})

        data_rows = [
            [
                row.get('Invoice Number'),
                row.get('Sale Date'),
                row.get('Customer'),
                row.get('Subtotal'),
                row.get('Discount'),
                row.get('Tax'),
                row.get('Total Amount'),
                row.get('Amount Paid'),
                row.get('Balance Due'),
                row.get('Payment Status'),
                row.get('Payment Method'),
                row.get('Created By'),
            ]
            for row in sales_data
        ]
        return generate_csv_response('sales_report', headers, data_rows)

    def inventory(self, request):
        export_format = request.query_params.get('file_format', 'csv')
        
        inventory_data = ReportService.get_inventory_export_rows()
        df = pd.DataFrame(inventory_data)
        
        headers = [
            'SKU',
            'Product Name',
            'Category',
            'Current Stock',
            'Reorder Level',
            'Stock Status',
            'Unit Cost',
            'Inventory Value',
            'Last Updated',
        ]
        
        if export_format == 'excel':
            return generate_excel_response('inventory_report', {'Inventory Summary': df[headers]})
        
        data_rows = [
            [
                row.get('SKU'),
                row.get('Product Name'),
                row.get('Category'),
                row.get('Current Stock'),
                row.get('Reorder Level'),
                row.get('Stock Status'),
                row.get('Unit Cost'),
                row.get('Inventory Value'),
                row.get('Last Updated'),
            ]
            for row in inventory_data
        ]
        return generate_csv_response('inventory_report', headers, data_rows)

    def stock_movements(self, request):
        export_format = request.query_params.get('file_format', 'csv')
        
        movement_data = ReportService.get_stock_movement_export_rows()
        df = pd.DataFrame(movement_data)
        
        headers = [
            'Movement ID',
            'SKU',
            'Product Name',
            'Movement Type',
            'Quantity',
            'User',
            'Date',
        ]
        
        if export_format == 'excel':
            return generate_excel_response('stock_movements_report', {'Stock Movements': df[headers]})
        
        data_rows = [
            [
                row.get('Movement ID'),
                row.get('SKU'),
                row.get('Product Name'),
                row.get('Movement Type'),
                row.get('Quantity'),
                row.get('User'),
                row.get('Date'),
            ]
            for row in movement_data
        ]
        return generate_csv_response('stock_movements_report', headers, data_rows)

    def purchases(self, request):
        export_format = request.query_params.get('file_format', 'csv')
        supplier_id = request.query_params.get('supplier')
        po_status = request.query_params.get('status')
        
        # Get purchase order summary data
        po_data = ReportService.get_purchase_order_export_rows()
        
        # Filter by supplier if provided
        if supplier_id:
            po_data = [po for po in po_data if po.get('Supplier') == supplier_id]
        
        # Filter by status if provided
        if po_status:
            po_data = [po for po in po_data if po.get('Status') == po_status]
        
        # Get purchase order items data
        po_items_data = ReportService.get_purchase_order_items_export_rows()
        
        # Filter items to only include those from filtered POs
        if po_data:
            po_numbers = [po['PO Number'] for po in po_data]
            po_items_data = [item for item in po_items_data if item['PO Number'] in po_numbers]
        
        # Headers for purchase orders
        po_headers = [
            'PO Number',
            'Supplier',
            'Order Date',
            'Status',
            'Expected Delivery',
            'Total Amount',
            'Created By',
            'Notes',
        ]
        
        # Headers for purchase order items
        item_headers = [
            'PO Number',
            'SKU',
            'Product Name',
            'Quantity',
            'Unit Cost',
            'Subtotal',
        ]
        
        # Excel export with two sheets
        if export_format == 'excel':
            po_df = pd.DataFrame(po_data)
            items_df = pd.DataFrame(po_items_data)
            return generate_excel_response('purchase_orders_report', {
                'Purchase Orders': po_df[po_headers] if not po_df.empty else po_df,
                'PO Items': items_df[item_headers] if not items_df.empty else items_df,
            })
        
        # CSV export - just the main PO summary
        po_data_rows = [
            [
                row.get('PO Number'),
                row.get('Supplier'),
                row.get('Order Date'),
                row.get('Status'),
                row.get('Expected Delivery'),
                row.get('Total Amount'),
                row.get('Created By'),
                row.get('Notes'),
            ]
            for row in po_data
        ]
        return generate_csv_response('purchase_orders_report', po_headers, po_data_rows)