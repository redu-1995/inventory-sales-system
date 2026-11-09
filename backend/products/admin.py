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
        column_name='category_name',
        attribute='category',
        widget=ForeignKeyWidget(Category, field='name')
    )

    supplier = fields.Field(
        column_name='supplier_company_name',
        attribute='supplier',
        widget=ForeignKeyWidget(Supplier, field='company_name')
    )

    class Meta:
        model = Product

        # Use SKU to identify products during import
        import_id_fields = ('sku',)

        fields = (
            'name',
            'sku',
            'barcode',
            'description',
            'cost_price',
            'selling_price',
            'status',
            'is_archived',
            'category',
            'supplier',
        )

        export_order = fields

        skip_unchanged = False
        report_skipped = True


# --------------------------------------------------
# 4. Product Admin
# --------------------------------------------------

@admin.register(Product)
class ProductAdmin(ImportExportModelAdmin):
    resource_classes = [ProductResource]

    list_display = (
        'id',
        'name',
        'sku',
        'cost_price',
        'selling_price',
        'category',
        'supplier',
        'status',
    )

    search_fields = ('name', 'sku', 'barcode')

    list_filter = (
        'category',
        'supplier',
        'status',
        'is_archived',
    )
