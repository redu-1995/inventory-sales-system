from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Count, F, ExpressionWrapper, DecimalField, Q

# Import models from your existing apps
from products.models import Product
from inventory.models import Inventory
from purchase_orders.models import PurchaseOrder  
from sales.models import Sale, Payment
from customers.models import Customer


class DashboardService:

    @classmethod
    def get_dashboard_data(cls):
        today = timezone.now().date()
        seven_days_ago = today - timedelta(days=6)

        # 1. KPI Cards Computation
        today_sales_qs = Sale.objects.filter(created_at__date=today)
        revenue_today = today_sales_qs.aggregate(total=Sum('total_amount'))['total'] or 0.00
        today_sales_count = today_sales_qs.count()

        # Inventory Value calculation: (Quantity * Purchase Price / Unit Cost)
        inventory_val_query = Inventory.objects.aggregate(
            total_val=Sum(
                ExpressionWrapper(
                    F('quantity') * F('product__cost_price'),
                    output_field=DecimalField()
                )
            )
        )['total_val'] or 0.00

        total_products = Product.objects.count()
        total_customers = Customer.objects.count()

        # Low Stock (quantity <= reorder_level)
        low_stock_qs = Inventory.objects.filter(quantity__lte=F('reorder_level'))
        low_stock_count = low_stock_qs.count()

        # 2. Sales Last 7 Days Chart Data
        labels = []
        values = []
        for i in range(7):
            day = seven_days_ago + timedelta(days=i)
            labels.append(day.strftime('%a'))  # e.g. Mon, Tue
            day_total = Sale.objects.filter(created_at__date=day).aggregate(total=Sum('total_amount'))['total'] or 0.00
            values.append(day_total)

        sales_chart = {'labels': labels, 'values': values}

        # 3. Low Stock Items (Limit 5)
        low_stock_items = [
            {
                'product': item.product.name,
                'stock': item.quantity,
                'reorder_level': item.reorder_level
            }
            for item in low_stock_qs.select_related('product')[:5]
        ]

        # 4. Recent Sales (Limit 5)
        recent_sales_qs = Sale.objects.select_related('customer').order_by('-created_at')[:5]
        recent_sales = [
            {
                'invoice_number': sale.invoice_number,
                'customer': sale.customer.name if sale.customer else 'Guest',
                'amount': sale.total_amount
            }
            for sale in recent_sales_qs
        ]

        # 5. Recent Purchase Orders (Limit 5)
        recent_pos_qs = PurchaseOrder.objects.select_related('supplier').order_by('-created_at')[:5]
        recent_purchase_orders = [
            {
                'po_number': po.po_number,
                'supplier': po.supplier.name if po.supplier else 'N/A',
                'status': po.status
            }
            for po in recent_pos_qs
        ]

        # 6. Top Selling Products (Limit 5)
        # Aggregates SaleItems / Sales
        top_products_qs = (
            Product.objects.annotate(total_sold=Sum('saleitem__quantity'))
            .filter(total_sold__gt=0)
            .order_by('-total_sold')[:5]
        )
        top_products = [
            {'product': prod.name, 'sold': prod.total_sold or 0}
            for prod in top_products_qs
        ]

        # 7. Payment Summary
        paid_count = Sale.objects.filter(payment_status='PAID').count()
        partial_count = Sale.objects.filter(payment_status='PARTIAL').count()
        unpaid_count = Sale.objects.filter(payment_status='UNPAID').count()
        payment_summary = {
            'paid': paid_count,
            'partial': partial_count,
            'unpaid': unpaid_count
        }

        # 8. Inventory Status Summary
        out_of_stock_count = Inventory.objects.filter(quantity=0).count()
        in_stock_count = Inventory.objects.filter(quantity__gt=F('reorder_level')).count()
        inventory_summary = {
            'in_stock': in_stock_count,
            'low_stock': low_stock_count,
            'out_of_stock': out_of_stock_count
        }

        # 9. Recent Activity Feed (Limit 5 combining Sales and POs)
        recent_activity = []
        for sale in recent_sales_qs[:3]:
            recent_activity.append({
                'time': sale.created_at.strftime('%H:%M'),
                'message': f"Sale {sale.invoice_number} added"
            })
        for po in recent_pos_qs[:2]:
            recent_activity.append({
                'time': po.created_at.strftime('%H:%M'),
                'message': f"Purchase Order #{po.po_number} {po.status.capitalize()}"
            })

        return {
            'revenue_today': revenue_today,
            'today_sales_count': today_sales_count,
            'inventory_value': inventory_val_query,
            'total_products': total_products,
            'total_customers': total_customers,
            'low_stock_count': low_stock_count,
            'sales_chart': sales_chart,
            'low_stock_items': low_stock_items,
            'recent_sales': recent_sales,
            'recent_purchase_orders': recent_purchase_orders,
            'top_products': top_products,
            'payment_summary': payment_summary,
            'inventory_summary': inventory_summary,
            'recent_activity': recent_activity
        }