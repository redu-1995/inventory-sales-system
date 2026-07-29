import re
from decimal import Decimal
from django.db.models import Sum, Q, F, ExpressionWrapper, DecimalField
from django.db.models.functions import Coalesce
from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    total_orders = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()
    outstanding_balance = serializers.SerializerMethodField()
    last_purchase = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = [
            "id",
            "full_name",
            "phone",
            "email",
            "address",
            "status",
            "notes",
            "created_at",
            "updated_at",
            "total_orders",
            "total_spent",
            "outstanding_balance",
            "last_purchase",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_phone(self, value):
        cleaned_phone = value.strip()
        # Basic format sanity check (supports formats like +251..., 09..., etc.)
        if not re.match(r'^\+?[0-9\s\-()]{7,20}$', cleaned_phone):
            raise serializers.ValidationError("Enter a valid phone number format.")

        # Exclude self on update operations
        qs = Customer.objects.filter(phone=cleaned_phone)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A customer with this phone number already exists.")

        return cleaned_phone

    def validate_email(self, value):
        if not value:
            return value
        cleaned_email = value.strip().lower()
        qs = Customer.objects.filter(email=cleaned_email)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A customer with this email address already exists.")
        return cleaned_email

    def validate_full_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Customer name cannot be empty.")
        return value.strip()

    def get_total_orders(self, obj):
        # Exclude cancelled orders
        return obj.sales.exclude(status__iexact='CANCELLED').count()

    def get_total_spent(self, obj):
        result = obj.sales.exclude(status__iexact='CANCELLED').aggregate(
            total=Coalesce(Sum('total_amount'), Decimal('0.00'))
        )
        return float(result['total'])

    def get_outstanding_balance(self, obj):
        # Calculate balance for unpaid/partially paid sales: total_amount - sum(payments)
        pending_sales = obj.sales.filter(
            Q(status__iexact='UNPAID') | Q(status__iexact='PARTIAL') | Q(status__iexact='PENDING')
        ).annotate(
            paid_amount=Coalesce(
                Sum('payments__amount'),
                Decimal('0.00'),
                output_field=DecimalField()
            )
        )

        balance_expr = ExpressionWrapper(
            F('total_amount') - F('paid_amount'),
            output_field=DecimalField()
        )

        total_due = pending_sales.aggregate(
            balance=Coalesce(Sum(balance_expr), Decimal('0.00'))
        )['balance']

        return float(total_due)

    def get_last_purchase(self, obj):
        last_sale = obj.sales.exclude(status__iexact='CANCELLED').order_by('-sale_date').first()
        return last_sale.sale_date.strftime('%Y-%m-%d %H:%M:%S') if last_sale else None