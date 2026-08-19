# products/admin.py
from django.contrib import admin
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from import_export.admin import ImportExportModelAdmin
from .models import Category, Supplier, Product

# --------------------------------------------------
# 1. Category Admin
# --------------------------------------------------
@admin.register(Category)
class CategoryAdmin(ImportExportModelAdmin):
    list_display = ('id', 'name', 'description', 'created_at')
    search_fields = ('name',)


# --------------------------------------------------
# 2. Supplier Admin
# --------------------------------------------------
@admin.register(Supplier)
class SupplierAdmin(ImportExportModelAdmin):
    list_display = ('id', 'company_name', 'contact_person', 'phone', 'email')
    search_fields = ('company_name', 'contact_person')


# --------------------------------------------------
# 3. Product Import/Export Resource
# --------------------------------------------------
class ProductResource(resources.ModelResource):
    category = fields.Field(
        column_name='category',
        attribute='category',
        widget=ForeignKeyWidget(Category, field='name')  # Lookup Category by name
    )
    supplier = fields.Field(
        column_name='supplier',
        attribute='supplier',
        widget=ForeignKeyWidget(Supplier, field='company_name')  # Lookup Supplier by company_name
    )

    class Meta:
        model = Product
        fields = (
            'id',
            'name',
            'sku',
            'barcode',
            'description',
            'cost_price',
            'selling_price',
            'status',
            'category',
            'supplier',
        )
        export_order = (
            'id',
            'name',
            'sku',
            'barcode',
            'description',
            'cost_price',
            'selling_price',
            'status',
            'category',
            'supplier',
        )


# --------------------------------------------------
# 4. Product Admin
# --------------------------------------------------
@admin.register(Product)
class ProductAdmin(ImportExportModelAdmin):
    resource_classes = [ProductResource]
    list_display = ('id', 'name', 'sku', 'cost_price', 'selling_price', 'category', 'supplier', 'status')
    search_fields = ('name', 'sku', 'barcode')
    list_filter = ('category', 'supplier', 'status', 'is_archived')