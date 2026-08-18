from django.contrib import admin
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from import_export.admin import ImportExportModelAdmin
from .models import Category, Supplier, Product

# --------------------------------------------------
# 1. Category & Supplier Admin
# --------------------------------------------------
@admin.register(Category)
class CategoryAdmin(ImportExportModelAdmin):
    pass


@admin.register(Supplier)
class SupplierAdmin(ImportExportModelAdmin):
    pass


# --------------------------------------------------
# 2. Product Import/Export Resource Configuration
# --------------------------------------------------
class ProductResource(resources.ModelResource):
    # Allows you to use Category & Supplier NAMES in your CSV instead of raw IDs
    category = fields.Field(
        column_name='category',
        attribute='category',
        widget=ForeignKeyWidget(Category, field='name')
    )
    supplier = fields.Field(
        column_name='supplier',
        attribute='supplier',
        widget=ForeignKeyWidget(Supplier, field='company_name')
    )

    class Meta:
        model = Product
        # Fields to include in import/export (adjust to match your exact Product model fields)
        fields = ('id', 'name', 'sku', 'price', 'quantity', 'category', 'supplier')
        export_order = ('id', 'name', 'sku', 'price', 'quantity', 'category', 'supplier')


# --------------------------------------------------
# 3. Product Admin
# --------------------------------------------------
@admin.register(Product)
class ProductAdmin(ImportExportModelAdmin):
    resource_classes = [ProductResource]