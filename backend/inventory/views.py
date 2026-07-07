from decimal import Decimal

from django.db.models import DecimalField, ExpressionWrapper, F, Q, Sum
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import (
    Inventory,
    StockMovement,
    PurchaseOrder,
    PurchaseOrderItem
)

from .serializers import (
    InventorySerializer,
    StockMovementSerializer,
    PurchaseOrderSerializer,
    PurchaseOrderItemSerializer
)


class InventoryViewSet(ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

    def get_queryset(self):
        queryset = super().get_queryset().select_related('product', 'product__category')

        search = self.request.query_params.get('search', '').strip()
        category = self.request.query_params.get('category', '').strip()
        status = self.request.query_params.get('status', '').strip()

        if search:
            queryset = queryset.filter(
                Q(product__name__icontains=search) | Q(product__sku__icontains=search)
            )

        if category:
            queryset = queryset.filter(product__category__name__icontains=category)

        if status:
            if status == 'OUT_OF_STOCK':
                queryset = queryset.filter(quantity=0)
            elif status == 'LOW_STOCK':
                queryset = queryset.filter(quantity__gt=0, quantity__lte=F('reorder_level'))
            elif status == 'IN_STOCK':
                queryset = queryset.filter(quantity__gt=F('reorder_level'))

        return queryset

    def list(self, request, *args, **kwargs):
        if request.query_params.get('summary') == 'true':
            queryset = self.filter_queryset(self.get_queryset())
            total_stock_units = queryset.aggregate(total=Sum('quantity'))['total'] or 0
            low_stock = queryset.filter(quantity__gt=0, quantity__lte=F('reorder_level')).count()
            out_of_stock = queryset.filter(quantity=0).count()
            inventory_value = queryset.aggregate(
                value=Sum(
                    ExpressionWrapper(F('quantity') * F('product__cost_price'), output_field=DecimalField())
                )
            )['value'] or Decimal('0.00')

            return Response({
                'total_stock_units': int(total_stock_units),
                'low_stock': low_stock,
                'out_of_stock': out_of_stock,
                'inventory_value': float(inventory_value),
            })

        return super().list(request, *args, **kwargs)


class StockMovementViewSet(ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
  

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PurchaseOrderViewSet(ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
  

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PurchaseOrderItemViewSet(ModelViewSet):
    queryset = PurchaseOrderItem.objects.all()
    serializer_class = PurchaseOrderItemSerializer
  