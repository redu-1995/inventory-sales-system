from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db import models
from django.db.models import Sum, Count

# Import source configurations from domain apps
from products.models import Product
from customers.models import Customer
from sales.models import Sale, SaleItem
from inventory.models import Inventory


class DashboardView(APIView):
    """
    Combines analytics from separate app architectures to provide
    a unified JSON document feeding frontend UI data KPI tiles.
    """
   

    def get(self, request):
        today = timezone.now().date()

        # 1. Multi-app foundational database entry counts
        total_products = Product.objects.count()
        total_customers = Customer.objects.count()
        total_categories = Product.objects.values('category').distinct().count()
        # 2. Extract completed checkout transaction historical values
        total_sales_count = Sale.objects.filter(status='PAID').count()

        # 3. Aggregate daily financial metrics
        daily_revenue_query = Sale.objects.filter(
            sale_date__date=today,
            status='PAID'
        ).aggregate(revenue=Sum('total_amount'))
        revenue_today = daily_revenue_query['revenue'] or 0.00

        # 4. Filter warning flags: items low in stock but still available (> 0)
        low_stock_count = Inventory.objects.filter(
            quantity__gt=0,
            quantity__lte=models.F("reorder_level")
        ).count()

        # 5. Filter warning flags: items completely out of stock (= 0)
        out_of_stock_count = Inventory.objects.filter(
            quantity=0
        ).count()

        return Response({
            "total_products": total_products,
            "total_categories": total_categories,
            "total_customers": total_customers,
            "total_sales": total_sales_count,
            "revenue_today": float(revenue_today),
            "low_stock": low_stock_count,
            "out_of_stock": out_of_stock_count
        })


class LowStockReportView(APIView):
    """
    Fetches an explicit data list tracking items requiring restock optimization, 
    excluding items already completely out of stock.
    """
   

    def get(self, request):
        # Fetch inventory rows below reorder level thresholds but strictly above 0
        low_stock_items = Inventory.objects.filter(
            quantity__gt=0,
            quantity__lte=models.F('reorder_level')
        ).select_related('product')

        # Structure data list payload for custom visualization grid
        data = [
            {
                "product_id": item.product.id,
                "product_name": item.product.name,
                "sku": item.product.sku,
                "current_quantity": item.quantity,
                "reorder_level": item.reorder_level
            }
            for item in low_stock_items
        ]
        return Response(data)


class OutOfStockReportView(APIView):
    """
    Fetches an explicit data list tracking items that have completely 
    reached zero availability.
    """
  

    def get(self, request):
        # Fetch inventory rows where quantity is exactly zero
        out_of_stock_items = Inventory.objects.filter(
            quantity=0
        ).select_related('product')

        # Structure data list payload for empty states/restock queues
        data = [
            {
                "product_id": item.product.id,
                "product_name": item.product.name,
                "sku": item.product.sku,
                "current_quantity": item.quantity
            }
            for item in out_of_stock_items
        ]
        return Response(data)


class TopMovingProductsReportView(APIView):
    """
    Identifies high-performing inventory assets by calculating 
    the total volume quantity sold.
    """
   

    def get(self, request):
        # Group by product IDs, aggregate quantities sold, and sort by performance volume
        top_products = SaleItem.objects.values(
            'product__id', 'product__name', 'product__sku'
        ).annotate(
            total_units_sold=Sum('quantity'),
            total_revenue_generated=Sum('subtotal')
        ).order_by('-total_units_sold')[:5]  # Limit result stream to top 5 assets

        return Response(top_products)