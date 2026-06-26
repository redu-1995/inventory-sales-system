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
  