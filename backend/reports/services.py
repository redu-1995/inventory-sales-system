# reports/services.py
from django.db.models import Sum, Count, F, Q, Avg, ExpressionWrapper, DecimalField
from django.db.models.functions import Coalesce, TruncDate
from decimal import Decimal
from datetime import datetime, timedelta
from django.utils import timezone

# Instead of datetime.now() or datetime.now().date():
now = timezone.now()

# Correct app imports according to your modular structure
from sales.models import Sale, SaleItem
from inventory.models import Inventory, StockMovement
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
            quantity__lte=F('reorder_level')
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
    def get_sales_export_rows(start_date=None, end_date=None, customer_id=None, payment_status=None):
        queryset = Sale.objects.select_related('customer', 'user').prefetch_related('items', 'payments').all()

        if start_date:
            queryset = queryset.filter(sale_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(sale_date__lte=end_date)
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        if payment_status:
            queryset = queryset.filter(status=payment_status)

        rows = []
        for sale in queryset.order_by('-sale_date'):
            subtotal = sale.items.aggregate(
                total=Coalesce(Sum('subtotal'), Decimal('0.00'))
            )['total'] or Decimal('0.00')

            rows.append({
                'Invoice Number': sale.invoice_number or f'INV-{sale.id}',
                'Sale Date': sale.sale_date.strftime('%Y-%m-%d') if sale.sale_date else '',
                'Customer': sale.customer.full_name if sale.customer else 'Walk-in Customer',
                'Subtotal': subtotal,
                'Discount': sale.discount_amount,
                'Tax': sale.tax_amount,
                'Total Amount': sale.total_amount,
                'Amount Paid': sale.paid_amount,
                'Balance Due': sale.remaining_amount,
                'Payment Status': sale.status,
                'Payment Method': sale.payment_method,
                'Created By': sale.user.username if sale.user else 'N/A',
            })

        return rows

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

        in_stock = Inventory.objects.filter(
            quantity__gt=F('reorder_level')
        ).count()
        low_stock = Inventory.objects.filter(
            quantity__gt=0,
            quantity__lte=F('reorder_level')
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
        # Query reorder_level directly from the Inventory model
        low_stock_items = Inventory.objects.filter(
            quantity__lte=F('reorder_level')
        ).select_related('product')

        return [
            {
                "product": item.product.name,
                "stock": item.quantity,
                "reorder_level": item.reorder_level
            }
            for item in low_stock_items
        ]

    @staticmethod
    def get_recent_transactions(limit=10):
        sales = Sale.objects.select_related('customer').order_by('-sale_date')[:limit]
        purchases = PurchaseOrder.objects.select_related('supplier').order_by('-order_date')[:limit]

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
            # If your model field is `company_name`:
            party_name = po.supplier.company_name if hasattr(po, 'supplier') and po.supplier else "N/A"
            transactions.append({
                "type": "Purchase",
                "reference": f"PO-{po.id:04d}",
                "party": party_name,
                "amount": po.total_amount,
                "date": po.order_date
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

    @staticmethod
    def get_inventory_export_rows():
        """
        Generate inventory summary export rows with calculated stock status.
        Returns list of dicts with columns:
        SKU, Product Name, Category, Current Stock, Reorder Level, 
        Stock Status, Unit Cost, Inventory Value, Last Updated
        """
        inventory_items = Inventory.objects.select_related('product', 'product__category').all()
        
        rows = []
        for inv in inventory_items.order_by('-updated_at'):
            product = inv.product
            quantity = inv.quantity
            
            # Calculate stock status
            if quantity == 0:
                status = 'Out of Stock'
            elif quantity <= inv.reorder_level:
                status = 'Low Stock'
            else:
                status = 'In Stock'
            
            # Calculate inventory value
            inventory_value = quantity * product.cost_price
            
            rows.append({
                'SKU': product.sku,
                'Product Name': product.name,
                'Category': product.category.name if product.category else 'N/A',
                'Current Stock': quantity,
                'Reorder Level': inv.reorder_level,
                'Stock Status': status,
                'Unit Cost': product.cost_price,
                'Inventory Value': inventory_value,
                'Last Updated': inv.updated_at.strftime('%Y-%m-%d %H:%M:%S') if inv.updated_at else 'N/A',
            })
        
        return rows

    @staticmethod
    def get_stock_movement_export_rows():
        """
        Generate stock movement history export rows.
        Returns list of dicts with columns:
        Movement ID, SKU, Product Name, Movement Type, Quantity, User, Date
        """
        movements = StockMovement.objects.select_related('product', 'user').order_by('-created_at')
        
        rows = []
        for movement in movements:
            product = movement.product
            rows.append({
                'Movement ID': movement.id,
                'SKU': product.sku,
                'Product Name': product.name,
                'Movement Type': movement.get_movement_type_display(),
                'Quantity': movement.quantity,
                'User': movement.user.username if movement.user else 'System',
                'Date': movement.created_at.strftime('%Y-%m-%d %H:%M:%S') if movement.created_at else 'N/A',
            })
        
        return rows

    @staticmethod
    def get_purchase_order_export_rows():
        """
        Generate purchase order summary export rows.
        Returns list of dicts with columns:
        PO Number, Supplier, Order Date, Status, Expected Delivery, Total Amount, Created By, Notes
        """
        purchase_orders = PurchaseOrder.objects.select_related('supplier', 'user').order_by('-order_date')
        
        rows = []
        for po in purchase_orders:
            rows.append({
                'PO Number': f'PO-{po.id:04d}',
                'Supplier': po.supplier.company_name if po.supplier else 'N/A',
                'Order Date': po.order_date.strftime('%Y-%m-%d %H:%M:%S') if po.order_date else 'N/A',
                'Status': po.get_status_display(),
                'Expected Delivery': po.expected_delivery.strftime('%Y-%m-%d') if po.expected_delivery else 'N/A',
                'Total Amount': po.total_amount,
                'Created By': po.user.username if po.user else 'System',
                'Notes': po.notes or '',
            })
        
        return rows

    @staticmethod
    def get_purchase_order_items_export_rows():
        """
        Generate purchase order items export rows.
        Returns list of dicts with columns:
        PO Number, SKU, Product Name, Quantity, Unit Cost, Subtotal
        """
        from purchase_orders.models import PurchaseOrderItem
        
        items = PurchaseOrderItem.objects.select_related('purchase_order', 'product').order_by('-purchase_order__order_date')
        
        rows = []
        for item in items:
            po = item.purchase_order
            product = item.product
            subtotal = item.subtotal
            
            rows.append({
                'PO Number': f'PO-{po.id:04d}',
                'SKU': product.sku,
                'Product Name': product.name,
                'Quantity': item.quantity,
                'Unit Cost': item.cost_price,
                'Subtotal': subtotal,
            })
        
        return rows

    @staticmethod
    def get_customer_export_rows():
        """
        Generate customer export rows with sales summary information.
        Returns list of dicts with columns:
        Customer ID, Customer Name, Phone, Email, Address, Status,
        Total Orders, Total Purchase Amount, Amount Paid, Outstanding Balance,
        Last Purchase Date, Created Date
        """
        customers = Customer.objects.all().order_by('-created_at')
        
        rows = []
        for customer in customers:
            # Get all sales for this customer
            sales = customer.sales.all()
            
            # Calculate totals
            total_orders = sales.count()
            total_purchase_amount = sales.aggregate(
                total=Coalesce(Sum('total_amount'), Decimal('0.00'))
            )['total']
            
            # Calculate amount paid (sum of paid_amount property for each sale)
            amount_paid = Decimal('0.00')
            outstanding_balance = Decimal('0.00')
            for sale in sales:
                amount_paid += sale.paid_amount
                outstanding_balance += sale.remaining_amount
            
            # Get last purchase date
            last_sale = sales.order_by('-sale_date').first()
            last_purchase_date = last_sale.sale_date.strftime('%Y-%m-%d') if last_sale and last_sale.sale_date else 'N/A'
            
            rows.append({
                'Customer ID': customer.id,
                'Customer Name': customer.full_name,
                'Phone': customer.phone or 'N/A',
                'Email': customer.email or 'N/A',
                'Address': customer.address or 'N/A',
                'Status': customer.get_status_display(),
                'Total Orders': total_orders,
                'Total Purchase Amount': total_purchase_amount,
                'Amount Paid': amount_paid,
                'Outstanding Balance': outstanding_balance,
                'Last Purchase Date': last_purchase_date,
                'Created Date': customer.created_at.strftime('%Y-%m-%d') if customer.created_at else 'N/A',
            })
        
        return rows