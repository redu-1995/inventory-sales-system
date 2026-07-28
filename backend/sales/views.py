import csv
from django.http import HttpResponse
from django.db import transaction
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Sale, SaleItem, Payment
from .serializers import (
    SaleSerializer,
    SaleItemSerializer,
    PaymentSerializer
)
from inventory.models import Inventory, StockMovement


class SaleViewSet(ModelViewSet):
    """
    Handles full lifecycle CRUD operations, stock-reversal deletion,
    and CSV reporting for Sales.
    """
    queryset = Sale.objects.select_related(
        'customer',
        'user'
    ).prefetch_related(
        'items',
        'payments'
    ).order_by('-sale_date')

    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

    # Enables perform_create to attach the logged-in user automatically
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # ==========================================
    # 1. Handles deleteSale() Safely
    # ==========================================
    @transaction.atomic
    def perform_destroy(self, instance):
        """
        When a Sale is deleted, reverse stock deductions by adding
        the item quantities back to Inventory and logging StockMovements.
        """
        user = self.request.user

        for item in instance.items.all():
            try:
                # Lock inventory row to handle multi-user race conditions
                inventory = Inventory.objects.select_for_update().get(product=item.product)
                inventory.quantity += item.quantity
                inventory.save()

                # Audit log for restock
                StockMovement.objects.create(
                    product=item.product,
                    movement_type='IN',
                    quantity=item.quantity,
                    user=user
                )
            except Inventory.DoesNotExist:
                # Proceed even if inventory record was removed
                pass

        # Perform the actual database deletion
        instance.delete()

    # ==========================================
    # 2. Handles exportSales() Endpoint
    # ==========================================
    @action(detail=False, methods=['get'], url_path='export')
    def export_sales(self, request):
        """
        Generates and streams a downloadable CSV report for exportSales().
        Route: GET /api/sales/export/
        """
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="sales_report.csv"'

        writer = csv.writer(response)
        # CSV Headers
        writer.writerow(['Sale ID', 'Customer Name', 'User', 'Total Amount', 'Status', 'Payment Method', 'Date'])

        # Query all sales (respecting prefetch for speed)
        sales = self.get_queryset()

        for sale in sales:
            writer.writerow([
                sale.id,
                sale.customer.full_name if sale.customer else 'N/A',
                sale.user.username if sale.user else 'N/A',
                sale.total_amount,
                sale.get_status_display(),
                sale.payment_method,
                sale.sale_date.strftime('%Y-%m-%d %H:%M:%S')
            ])

        return response


class SaleItemViewSet(ModelViewSet):
    """
    Handles CRUD operations for individual Sale Items.
    """
    queryset = SaleItem.objects.select_related('sale', 'product')
    serializer_class = SaleItemSerializer
    permission_classes = [IsAuthenticated]


class PaymentViewSet(ModelViewSet):
    """
    Handles CRUD operations and payments for sales (receivePayment).
    """
    queryset = Payment.objects.select_related('sale')
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]