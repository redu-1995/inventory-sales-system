# customers/admin.py
from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from .models import Customer


# --------------------------------------------------
# 1. Customer Import/Export Resource
# --------------------------------------------------
class CustomerResource(resources.ModelResource):
    class Meta:
        model = Customer
        fields = (
            'id',
            'full_name',
            'phone',
            'email',
            'address',
            'status',
            'notes',
        )
        export_order = (
            'id',
            'full_name',
            'phone',
            'email',
            'address',
            'status',
            'notes',
        )


# --------------------------------------------------
# 2. Customer Admin
# --------------------------------------------------
@admin.register(Customer)
class CustomerAdmin(ImportExportModelAdmin):
    resource_classes = [CustomerResource]
    list_display = ('id', 'full_name', 'phone', 'email', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('full_name', 'phone', 'email')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')