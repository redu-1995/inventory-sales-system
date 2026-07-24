from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import PurchaseOrder
from .serializers import PurchaseOrderSerializer


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.select_related('supplier', 'user').prefetch_related('items__product').all()
    serializer_class = PurchaseOrderSerializer

    def get_queryset(self):
        qs = super().get_queryset()

        # Optional filters
        supplier_id = self.request.query_params.get('supplier')
        status_param = self.request.query_params.get('status')
        ordering = self.request.query_params.get('ordering', 'newest')

        if supplier_id:
            qs = qs.filter(supplier_id=supplier_id)
        if status_param:
            qs = qs.filter(status=status_param)

        # Ordering safely mapped to order_date
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
    def receive(self, request, pk=None):
        """Custom Action: POST /api/purchase-orders/<id>/receive/"""
        purchase_order = self.get_object()

        if purchase_order.status != 'PENDING':
            return Response(
                {"error": f"Cannot receive order. Current status is '{purchase_order.status}'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Delegate update logic & stock movement to serializer
        serializer = self.get_serializer(purchase_order, data={'status': 'RECEIVED'}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

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

        serializer = self.get_serializer(purchase_order, data={'status': 'CANCELLED'}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)