# backend/purchase_orders/admin.py
from django.contrib import admin
from django.contrib import messages
from .models import PurchaseOrder, PurchaseOrderItem
from .services import receive_purchase_order


class PurchaseOrderItemInline(admin.TabularInline):
    model = PurchaseOrderItem
    extra = 1
    # REMOVED: autocomplete_fields = ['product']  <-- Commented out to avoid admin.E040
    fields = ('product', 'quantity', 'cost_price', 'get_subtotal')
    readonly_fields = ('get_subtotal',)

    @admin.display(description='Subtotal')
    def get_subtotal(self, obj):
        if obj.quantity and obj.cost_price:
            return f"${obj.quantity * obj.cost_price:,.2f}"
        return "$0.00"


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'supplier',
        'formatted_total',
        'status',
        'user',
        'expected_delivery',
        'order_date',
    )
    list_filter = ('status', 'supplier', 'order_date')
    search_fields = ('id', 'supplier__company_name', 'user__username', 'notes')
    readonly_fields = ('order_date', 'total_amount')
    inlines = [PurchaseOrderItemInline]
    date_hierarchy = 'order_date'
    actions = ['mark_as_received', 'mark_as_cancelled']

    @admin.display(description='Total Amount', ordering='total_amount')
    def formatted_total(self, obj):
        return f"${obj.total_amount:,.2f}"

    @admin.action(description='Mark selected purchase orders as RECEIVED')
    def mark_as_received(self, request, queryset):
        success_count = 0
        for po in queryset:
            if po.status == 'PENDING':
                try:
                    receive_purchase_order(po, user=request.user)
                    success_count += 1
                except Exception as e:
                    self.message_user(
                        request,
                        f"Failed to receive PO #{po.id}: {str(e)}",
                        level=messages.ERROR
                    )
            else:
                self.message_user(
                    request,
                    f"PO #{po.id} skipped (only PENDING orders can be received).",
                    level=messages.WARNING
                )
        if success_count > 0:
            self.message_user(
                request,
                f"Successfully received {success_count} purchase order(s) and updated inventory stock.",
                level=messages.SUCCESS
            )

    @admin.action(description='Mark selected purchase orders as CANCELLED')
    def mark_as_cancelled(self, request, queryset):
        updated = queryset.filter(status='PENDING').update(status='CANCELLED')
        if updated:
            self.message_user(
                request,
                f"Successfully cancelled {updated} purchase order(s).",
                level=messages.SUCCESS
            )
        else:
            self.message_user(
                request,
                "No PENDING purchase orders were selected to cancel.",
                level=messages.WARNING
            )

    def save_model(self, request, obj, form, change):
        """Automatically set user on creation if not selected."""
        if not obj.pk and not obj.user:
            obj.user = request.user
        super().save_model(request, obj, form, change)


@admin.register(PurchaseOrderItem)
class PurchaseOrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'purchase_order', 'product', 'quantity', 'cost_price')
    search_fields = ('product__name', 'purchase_order__id')
    list_filter = ('purchase_order__status',)