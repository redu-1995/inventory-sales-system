# reports/services.py
from django.db.models import Sum, Count, F, Q, Avg, ExpressionWrapper, DecimalField
from django.db.models.functions import Coalesce, TruncDate
from decimal import Decimal
from datetime import datetime, timedelta

# Correct app imports according to your modular structure
from sales.models import Sale, SaleItem
from inventory.models import Inventory
from purchase_orders.models import PurchaseOrder  
from products.models import Product
from customers.models import Customer


class ReportService:

    @staticmethod
    def get_dashboard_summary():
        # Total Revenue
        total_revenue = Sale.objects.aggregate(
            total=Coalesce(Sum('total_amount'), Decimal('0.00'))
        )['total']

        # Total Purchases (Received Purchase Orders)
        total_purchases = PurchaseOrder.objects.filter(
            status='RECEIVED'
        ).aggregate(
            total=Coalesce(Sum('total_amount'), Decimal('0.00'))
        )['total']

        # Inventory Value: sum(inventory.quantity * product.cost_price)
        inventory_value = Inventory.objects.aggregate(
            total_val=Coalesce(
                Sum(ExpressionWrapper(F('quantity') * F('product__cost_price'), output_field=DecimalField())),
                Decimal('0.00')
            )
        )['total_val']

        customers_count = Customer.objects.count()

        # Low Stock count (quantity <= min_stock_level)
        low_stock_count = Inventory.objects.filter(
            quantity__lte=F('product__min_stock_level')
        ).count()

        # Products Sold Total Quantity
        products_sold_count = SaleItem.objects.aggregate(
            total_qty=Coalesce(Sum('quantity'), 0)
        )['total_qty']

        return {
            "total_revenue": total_revenue,
            "total_purchases": total_purchases,
            "inventory_value": inventory_value,
            "customers": customers_count,
            "low_stock": low_stock_count,
            "products_sold": products_sold_count
        }

    @staticmethod
    def get_sales_report(start_date=None, end_date=None, customer_id=None, payment_status=None):
        queryset = Sale.objects.all()

        if start_date:
            queryset = queryset.filter(sale_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(sale_date__lte=end_date)
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        if payment_status:
            queryset = queryset.filter(status=payment_status)

        total_sales = queryset.aggregate(total=Coalesce(Sum('total_amount'), Decimal('0.00')))['total']
        total_orders = queryset.count()
        average_order = Decimal('0.00') if total_orders == 0 else (total_sales / total_orders)

        daily_sales = queryset.annotate(
            date=TruncDate('sale_date')
        ).values('date').annotate(
            sales=Sum('total_amount'),
            orders=Count('id')
        ).order_by('date')

        return {
            "total_sales": total_sales,
            "total_orders": total_orders,
            "average_order": round(average_order, 2),
            "daily_sales": list(daily_sales)
        }

    @staticmethod
    def get_purchase_report(supplier_id=None, status=None, start_date=None, end_date=None):
        queryset = PurchaseOrder.objects.all()

        if supplier_id:
            queryset = queryset.filter(supplier_id=supplier_id)
        if status:
            queryset = queryset.filter(status=status)
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)

        total_orders = queryset.count()
        received = queryset.filter(status='RECEIVED').count()
        pending = queryset.filter(status='PENDING').count()
        cancelled = queryset.filter(status='CANCELLED').count()

        total_cost = queryset.aggregate(total=Coalesce(Sum('total_amount'), Decimal('0.00')))['total']

        return {
            "purchase_orders": total_orders,
            "received": received,
            "pending": pending,
            "cancelled": cancelled,
            "total_purchase_cost": total_cost
        }

    @staticmethod
    def get_inventory_report():
        total_products = Product.objects.count()

        inventory_value = Inventory.objects.aggregate(
            total_val=Coalesce(
                Sum(ExpressionWrapper(F('quantity') * F('product__cost_price'), output_field=DecimalField())),
                Decimal('0.00')
            )
        )['total_val']

        in_stock = Inventory.objects.filter(quantity__gt=F('product__min_stock_level')).count()
        low_stock = Inventory.objects.filter(
            quantity__gt=0,
            quantity__lte=F('product__min_stock_level')
        ).count()
        out_of_stock = Inventory.objects.filter(quantity=0).count()

        return {
            "inventory_value": inventory_value,
            "products": total_products,
            "in_stock": in_stock,
            "low_stock": low_stock,
            "out_of_stock": out_of_stock
        }

    @staticmethod
    def get_customer_report():
        total_customers = Customer.objects.count()

        outstanding = Sale.objects.filter(
            status__in=['UNPAID', 'PARTIAL']
        ).aggregate(
            total=Coalesce(Sum('total_amount'), Decimal('0.00'))
        )['total']

        ninety_days_ago = datetime.now() - timedelta(days=90)
        active_customers = Customer.objects.filter(sales__sale_date__gte=ninety_days_ago).distinct().count()
        inactive_customers = total_customers - active_customers

        first_of_month = datetime.now().replace(day=1)
        new_this_month = Customer.objects.filter(created_at__gte=first_of_month).count()

        return {
            "customers": total_customers,
            "active": active_customers,
            "inactive": max(0, inactive_customers),
            "new_this_month": new_this_month,
            "outstanding_balance": outstanding
        }

    @staticmethod
    def get_top_products(limit=10):
        top_items = SaleItem.objects.values(
            product_name=F('product__name')
        ).annotate(
            sold=Sum('quantity'),
            revenue=Sum('subtotal')
        ).order_by('-sold')[:limit]

        return [
            {
                "product": item['product_name'],
                "sold": item['sold'],
                "revenue": item['revenue']
            }
            for item in top_items
        ]

    @staticmethod
    def get_low_stock_report():
        low_stock_items = Inventory.objects.filter(
            quantity__lte=F('product__min_stock_level')
        ).select_related('product')

        return [
            {
                "product": item.product.name,
                "stock": item.quantity,
                "reorder_level": item.product.min_stock_level
            }
            for item in low_stock_items
        ]

    @staticmethod
    def get_recent_transactions(limit=10):
        sales = Sale.objects.select_related('customer').order_by('-sale_date')[:limit]
        purchases = PurchaseOrder.objects.select_related('supplier').order_by('-created_at')[:limit]

        transactions = []

        for sale in sales:
            party_name = sale.customer.full_name if sale.customer else "Walk-in Customer"
            transactions.append({
                "type": "Sale",
                "reference": f"INV-{sale.id:04d}",
                "party": party_name,
                "amount": sale.total_amount,
                "date": sale.sale_date
            })

        for po in purchases:
            party_name = po.supplier.name if hasattr(po, 'supplier') and po.supplier else "N/A"
            transactions.append({
                "type": "Purchase",
                "reference": f"PO-{po.id:04d}",
                "party": party_name,
                "amount": po.total_amount,
                "date": po.created_at
            })

        transactions.sort(key=lambda x: x['date'], reverse=True)
        return transactions[:limit]

    @staticmethod
    def get_sales_chart_data(days=7):
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days - 1)

        sales_data = Sale.objects.filter(
            sale_date__date__gte=start_date,
            sale_date__date__lte=end_date
        ).annotate(
            date=TruncDate('sale_date')
        ).values('date').annotate(
            total=Sum('total_amount')
        )

        sales_map = {item['date']: item['total'] for item in sales_data}

        labels = []
        values = []

        for i in range(days):
            current_day = start_date + timedelta(days=i)
            labels.append(current_day.strftime("%a"))
            values.append(sales_map.get(current_day, Decimal('0.00')))

        return {
            "labels": labels,
            "values": values
        }