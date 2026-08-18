# products/admin.py
from django.contrib import admin
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from import_export.admin import ImportExportModelAdmin
from .models import Category, Supplier, Product

class ProductResource(resources.ModelResource):
    category = fields.Field(
        column_name='category',
        attribute='category',
        widget=ForeignKeyWidget(Category, field='name') 
    )
    supplier = fields.Field(
        column_name='supplier',
        attribute='supplier',
        widget=ForeignKeyWidget(Supplier, field='company_name')  # Matches 'company_name' in Supplier model
    )

    class Meta:
        model = Product
        fields = ('id', 'name', 'sku', 'category', 'supplier')

@admin.register(Product)
class ProductAdmin(ImportExportModelAdmin):
    resource_classes = [ProductResource]  