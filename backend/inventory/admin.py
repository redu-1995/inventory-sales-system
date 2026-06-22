from django.contrib import admin
from .models import Inventory, StockMovement, PurchaseOrder, PurchaseOrderItem

admin.site.register(Inventory)
admin.site.register(StockMovement)
admin.site.register(PurchaseOrder)
admin.site.register(PurchaseOrderItem)