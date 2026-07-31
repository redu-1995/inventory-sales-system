from rest_framework import serializers

class SalesChartSerializer(serializers.Serializer):
    labels = serializers.ListField(child=serializers.CharField())
    values = serializers.ListField(child=serializers.DecimalField(max_digits=12, decimal_places=2))

class LowStockItemSerializer(serializers.Serializer):
    product = serializers.CharField()
    stock = serializers.IntegerField()
    reorder_level = serializers.IntegerField()

class RecentSaleSerializer(serializers.Serializer):
    invoice_number = serializers.CharField()
    customer = serializers.CharField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)

class RecentPOSerializer(serializers.Serializer):
    po_number = serializers.CharField()
    supplier = serializers.CharField()
    status = serializers.CharField()

class TopProductSerializer(serializers.Serializer):
    product = serializers.CharField()
    sold = serializers.IntegerField()

class PaymentSummarySerializer(serializers.Serializer):
    paid = serializers.IntegerField()
    partial = serializers.IntegerField()
    unpaid = serializers.IntegerField()

class InventorySummarySerializer(serializers.Serializer):
    in_stock = serializers.IntegerField()
    low_stock = serializers.IntegerField()
    out_of_stock = serializers.IntegerField()

class RecentActivitySerializer(serializers.Serializer):
    time = serializers.CharField()
    message = serializers.CharField()

class DashboardSerializer(serializers.Serializer):
    # 1. KPI Summaries
    revenue_today = serializers.DecimalField(max_digits=12, decimal_places=2)
    today_sales_count = serializers.IntegerField()
    inventory_value = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_products = serializers.IntegerField()
    total_customers = serializers.IntegerField()
    low_stock_count = serializers.IntegerField()

    # 2. Charts & Widgets
    sales_chart = SalesChartSerializer()
    low_stock_items = LowStockItemSerializer(many=True)
    recent_sales = RecentSaleSerializer(many=True)
    recent_purchase_orders = RecentPOSerializer(many=True)
    top_products = TopProductSerializer(many=True)
    payment_summary = PaymentSummarySerializer()
    inventory_summary = InventorySummarySerializer()
    recent_activity = RecentActivitySerializer(many=True)