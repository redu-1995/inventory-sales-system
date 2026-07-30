# reports/serializers.py
from rest_framework import serializers


class DashboardSummarySerializer(serializers.Serializer):
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_purchases = serializers.DecimalField(max_digits=12, decimal_places=2)
    inventory_value = serializers.DecimalField(max_digits=12, decimal_places=2)
    customers = serializers.IntegerField()
    low_stock = serializers.IntegerField()
    products_sold = serializers.IntegerField()


class SalesReportSerializer(serializers.Serializer):
    total_sales = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_orders = serializers.IntegerField()
    average_order = serializers.DecimalField(max_digits=12, decimal_places=2)
    daily_sales = serializers.ListField()


class PurchaseReportSerializer(serializers.Serializer):
    purchase_orders = serializers.IntegerField()
    received = serializers.IntegerField()
    pending = serializers.IntegerField()
    cancelled = serializers.IntegerField()
    total_purchase_cost = serializers.DecimalField(max_digits=12, decimal_places=2)


class InventoryReportSerializer(serializers.Serializer):
    inventory_value = serializers.DecimalField(max_digits=12, decimal_places=2)
    products = serializers.IntegerField()
    in_stock = serializers.IntegerField()
    low_stock = serializers.IntegerField()
    out_of_stock = serializers.IntegerField()


class CustomerReportSerializer(serializers.Serializer):
    customers = serializers.IntegerField()
    active = serializers.IntegerField()
    inactive = serializers.IntegerField()
    new_this_month = serializers.IntegerField()
    outstanding_balance = serializers.DecimalField(max_digits=12, decimal_places=2)


class TopProductSerializer(serializers.Serializer):
    product = serializers.CharField()
    sold = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)


class LowStockSerializer(serializers.Serializer):
    product = serializers.CharField()
    stock = serializers.IntegerField()
    reorder_level = serializers.IntegerField()


class RecentTransactionSerializer(serializers.Serializer):
    type = serializers.CharField()
    reference = serializers.CharField()
    party = serializers.CharField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    date = serializers.DateTimeField()


class ChartDataSerializer(serializers.Serializer):
    labels = serializers.ListField(child=serializers.CharField())
    values = serializers.ListField(child=serializers.DecimalField(max_digits=12, decimal_places=2))