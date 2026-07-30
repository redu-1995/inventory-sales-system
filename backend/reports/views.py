# reports/views.py
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

    # ---------------- Export Endpoints ----------------

    @action(detail=False, methods=['get'], url_path='export/sales')
    def export_sales(self, request):
        export_format = request.query_params.get('format', 'csv')
        sales_data = ReportService.get_sales_report()['daily_sales']

        df = pd.DataFrame(sales_data)

        if export_format == 'excel':
            return generate_excel_response('sales_report', {'Sales Summary': df})
        
        headers = ['Date', 'Sales', 'Orders']
        data_rows = [[row.get('date'), row.get('sales'), row.get('orders')] for row in sales_data]
        return generate_csv_response('sales_report', headers, data_rows)

    @action(detail=False, methods=['get'], url_path='export/inventory')
    def export_inventory(self, request):
        export_format = request.query_params.get('format', 'csv')
        low_stock = ReportService.get_low_stock_report()

        df = pd.DataFrame(low_stock)

        if export_format == 'excel':
            return generate_excel_response('inventory_report', {'Low Stock': df})

        headers = ['Product', 'Stock', 'Reorder Level']
        data_rows = [[item['product'], item['stock'], item['reorder_level']] for item in low_stock]
        return generate_csv_response('inventory_report', headers, data_rows)