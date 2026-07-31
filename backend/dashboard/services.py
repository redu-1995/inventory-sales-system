from datetime import timedelta
from decimal import Decimal
from django.utils import timezone
from django.db.models import Sum, F, Value
from django.db.models.functions import Coalesce

from sales.models import Sale, SaleItem
from products.models import Product
from customers.models import Customer
from inventory.models import Inventory
from purchase_orders.models import PurchaseOrder  
class DashboardService:

    @staticmethod
    def get_dashboard_data():
        now = timezone.now()
        today = now.date()
        seven_days_ago = today - timedelta(days=6)

        # -------------------------------------------------------------
        # 1. KPI SUMMARY METRICS
        # -------------------------------------------------------------
        revenue_today = (
            Sale.objects.filter(sale_date__date=today).aggregate(
                total=Sum('total_amount')
            )['total'] or Decimal('0.00')
        )

        today_sales_count = Sale.objects.filter(
            sale_date__date=today
        ).count()

        total_customers = Customer.objects.count()
        total_products = Product.objects.count()

        # -------------------------------------------------------------
        # 2. INVENTORY METRICS
        # -------------------------------------------------------------
        # Low Stock: quantity > 0 and quantity <= reorder_level
        low_stock_qs = Inventory.objects.filter(
            quantity__gt=0,
            quantity__lte=Coalesce(F('reorder_level'), Value(5))
        )
        low_stock_count = low_stock_qs.count()

        # In Stock: quantity > reorder_level
        in_stock_count = Inventory.objects.filter(
            quantity__gt=Coalesce(F('reorder_level'), Value(5))
        ).count()

        # Out of Stock: quantity <= 0
        out_of_stock_count = Inventory.objects.filter(
            quantity__lte=0
        ).count()

        # Inventory Total Value
        inventory_items = Inventory.objects.select_related('product')
        inventory_value = Decimal('0.00')

        for item in inventory_items:
            price = getattr(
                item.product,
                'cost_price',
                getattr(item.product, 'selling_price', Decimal('0.00')),
            )
            inventory_value += Decimal(str(item.quantity)) * Decimal(str(price or '0.00'))

        # -------------------------------------------------------------
        # 3. PAYMENT SUMMARY
        # -------------------------------------------------------------
        paid_count = Sale.objects.filter(status='PAID').count()
        partial_count = Sale.objects.filter(status='PARTIAL').count()
        unpaid_count = Sale.objects.filter(status='UNPAID').count()

        # -------------------------------------------------------------
        # 4. 7-DAY SALES CHART DATA
        # -------------------------------------------------------------
        chart_labels = []
        chart_values = []

        for i in range(7):
            current_day = seven_days_ago + timedelta(days=i)
            chart_labels.append(current_day.strftime('%a'))

            day_total = (
                Sale.objects.filter(sale_date__date=current_day).aggregate(
                    total=Sum('total_amount')
                )['total'] or Decimal('0.00')
            )
            chart_values.append(float(day_total))

        # -------------------------------------------------------------
        # 5. TOP SELLING PRODUCTS
        # -------------------------------------------------------------
        top_products_qs = (
            SaleItem.objects.values('product__name')
            .annotate(sold=Sum('quantity'))
            .order_by('-sold')[:5]
        )

        top_products = [
            {'product': item['product__name'], 'sold': item['sold']}
            for item in top_products_qs
        ]

        # -------------------------------------------------------------
        # 6. LOW STOCK ITEMS TABLE
        # -------------------------------------------------------------
        low_stock_items = [
            {
                'product': inv.product.name if inv.product else 'Unknown Product',
                'stock': inv.quantity,
                'reorder_level': getattr(inv, 'reorder_level', 5),
            }
            for inv in low_stock_qs.select_related('product')[:5]
        ]

        # -------------------------------------------------------------
        # 7. RECENT SALES
        # -------------------------------------------------------------
        recent_sales_qs = (
            Sale.objects.select_related('customer')
            .order_by('-sale_date')[:5]
        )

        recent_sales = [
            {
                'invoice_number': f"INV-{sale.id:04d}",
                'customer': sale.customer.full_name if sale.customer else 'Guest',
                'amount': float(sale.total_amount),
                'status': sale.status,
                'date': sale.sale_date.strftime('%Y-%m-%d %H:%M'),
            }
            for sale in recent_sales_qs
        ]

        # -------------------------------------------------------------
        # 8. RECENT PURCHASE ORDERS
        # -------------------------------------------------------------
        po_qs = PurchaseOrder.objects.select_related('supplier').order_by('-id')[:5]
        recent_purchase_orders = [
            {
                'po_number': getattr(po, 'po_number', f"PO-{po.id:04d}"),
                'supplier': po.supplier.company_name  if getattr(po, 'supplier', None) else 'N/A',
                'status': getattr(po, 'status', 'Pending'),
            }
            for po in po_qs
        ]

        # -------------------------------------------------------------
        # 9. RECENT ACTIVITY FEED
        # -------------------------------------------------------------
        recent_activity = []
        for sale in recent_sales_qs[:5]:
            msg = f"New sale INV-{sale.id:04d} created for {sale.customer.full_name if sale.customer else 'Guest'} (${sale.total_amount})"
            time_str = sale.sale_date.strftime('%Y-%m-%d %H:%M')

            recent_activity.append({
                'id': sale.id,
                'type': 'sale',
                'time': time_str,
                'timestamp': time_str,
                'message': msg,
                'description': msg,
            })

        # -------------------------------------------------------------
        # 10. RESPONSE CONSTRUCT
        # -------------------------------------------------------------
        return {
            'revenue_today': float(revenue_today),
            'today_sales_count': today_sales_count,
            'total_customers': total_customers,
            'total_products': total_products,
            'inventory_value': float(inventory_value),
            'low_stock_count': low_stock_count,
            'sales_chart': {
                'labels': chart_labels,
                'values': chart_values,
            },
            'inventory_summary': {
                'in_stock': in_stock_count,
                'low_stock': low_stock_count,
                'out_of_stock': out_of_stock_count,
            },
            'payment_summary': {
                'paid': paid_count,
                'partial': partial_count,
                'unpaid': unpaid_count,
            },
            'top_products': top_products,
            'low_stock_items': low_stock_items,
            'recent_sales': recent_sales,
            'recent_purchase_orders': recent_purchase_orders,
            'recent_activity': recent_activity,
        }