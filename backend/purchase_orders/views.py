import csv
from django.http import HttpResponse
from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import PurchaseOrder
from .serializers import PurchaseOrderSerializer
from inventory.models import Inventory, StockMovement


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.select_related('supplier', 'user').prefetch_related('items__product').all()
    serializer_class = PurchaseOrderSerializer

    def get_queryset(self):
        qs = super().get_queryset()

        supplier_id = self.request.query_params.get('supplier')
        status_param = self.request.query_params.get('status')
        ordering = self.request.query_params.get('ordering', 'newest')

        if supplier_id:
            qs = qs.filter(supplier_id=supplier_id)
        if status_param:
            qs = qs.filter(status=status_param)

        if ordering == 'oldest':
            return qs.order_by('order_date')
        return qs.order_by('-order_date')

    def destroy(self, request, *args, **kwargs):
        """Rule: Only allow deletion if status == PENDING"""
        instance = self.get_object()
        if instance.status != 'PENDING':
            return Response(
                {"error": f"Cannot delete a purchase order with status '{instance.status}'. Only PENDING orders can be deleted."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'], url_path='receive')
    @transaction.atomic
    def receive(self, request, pk=None):
        purchase_order = self.get_object()

        if purchase_order.status != 'PENDING':
            return Response(
                {"error": f"Cannot receive order. Current status is '{purchase_order.status}'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        items = purchase_order.items.select_related('product').all()
        if not items.exists():
            return Response(
                {"error": "This purchase order has no items to receive."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user if request.user.is_authenticated else None

        for item in items:
            # Increment stock
            inventory, _ = Inventory.objects.select_for_update().get_or_create(
                product=item.product,
                defaults={'quantity': 0}
            )
            inventory.quantity += item.quantity
            inventory.save()

            # Record Stock Movement with ONLY valid model fields
            StockMovement.objects.create(
                product=item.product,
                movement_type='IN',
                quantity=item.quantity,
                user=user
            )

        # Update PO status
        purchase_order.status = 'RECEIVED'
        purchase_order.save()

        serializer = self.get_serializer(purchase_order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        """Custom Action: POST /api/purchase-orders/<id>/cancel/"""
        purchase_order = self.get_object()

        if purchase_order.status != 'PENDING':
            return Response(
                {"error": f"Cannot cancel order. Current status is '{purchase_order.status}'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        purchase_order.status = 'CANCELLED'
        purchase_order.save()

        serializer = self.get_serializer(purchase_order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='export')
    def export(self, request):
        """Custom Action: GET /api/purchase-orders/export/"""
        queryset = self.filter_queryset(self.get_queryset())

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="purchase_orders.csv"'

        writer = csv.writer(response)
        writer.writerow(['ID', 'PO Number', 'Supplier', 'Status', 'Total Amount', 'Order Date'])

        for order in queryset:
            writer.writerow([
                order.id,
                getattr(order, 'po_number', f"PO-{order.id}"),
                order.supplier.company_name if order.supplier else '',
                order.status,
                getattr(order, 'total_amount', 0),
                order.order_date
            ])

        return response