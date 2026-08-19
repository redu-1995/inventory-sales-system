# inventory/admin.py
from django.contrib import admin
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from import_export.admin import ImportExportModelAdmin
from django.contrib.auth import get_user_model
from products.models import Product
from .models import Inventory, StockMovement

User = get_user_model()

# --------------------------------------------------
# 1. Inventory Resource & Admin
# --------------------------------------------------
class InventoryResource(resources.ModelResource):
    # Matches the Product by its SKU column (e.g., SKU-SKN-001)
    product = fields.Field(
        column_name='product_sku',
        attribute='product',
        widget=ForeignKeyWidget(Product, field='sku')
    )

    class Meta:
        model = Inventory
        fields = ('id', 'product', 'quantity', 'reorder_level')
        export_order = ('id', 'product', 'quantity', 'reorder_level')


@admin.register(Inventory)
class InventoryAdmin(ImportExportModelAdmin):
    resource_classes = [InventoryResource]
    list_display = ('id', 'get_product_name', 'get_product_sku', 'quantity', 'reorder_level', 'updated_at')
    search_fields = ('product__name', 'product__sku')
    list_filter = ('reorder_level',)

    @admin.display(description='Product Name')
    def get_product_name(self, obj):
        return obj.product.name

    @admin.display(description='SKU')
    def get_product_sku(self, obj):
        return obj.product.sku


# --------------------------------------------------
# 2. Stock Movement Resource & Admin
# --------------------------------------------------
class StockMovementResource(resources.ModelResource):
    product = fields.Field(
        column_name='product_sku',
        attribute='product',
        widget=ForeignKeyWidget(Product, field='sku')
    )
    user = fields.Field(
        column_name='user',
        attribute='user',
        widget=ForeignKeyWidget(User, field='username')
    )

    class Meta:
        model = StockMovement
        fields = ('id', 'product', 'movement_type', 'quantity', 'user', 'created_at')
        export_order = ('id', 'product', 'movement_type', 'quantity', 'user', 'created_at')


@admin.register(StockMovement)
class StockMovementAdmin(ImportExportModelAdmin):
    resource_classes = [StockMovementResource]
    list_display = ('id', 'product', 'movement_type', 'quantity', 'user', 'created_at')
    search_fields = ('product__name', 'product__sku', 'user__username')
    list_filter = ('movement_type', 'created_at')