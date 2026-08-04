# core/services.py
from django.db.models import Q
from products.models import Product
from customers.models import Customer
from sales.models import Sale
# Import PurchaseOrder if present in your codebase:
# from purchase_orders.models import PurchaseOrder

class SearchService:
    @staticmethod
    def search_all(query, limit=5):
        query = query.strip()
        
        # Guard clause: avoid running expensive queries on 1-character searches
        if not query or len(query) < 2:
            return {
                "products": [],
                "customers": [],
                "sales": [],
                "purchase_orders": []
            }

        # Query across independent domain models safely
        products = Product.objects.filter(
            Q(name__icontains=query) | Q(sku__icontains=query)
        )[:limit]

        customers = Customer.objects.filter(
            Q(name__icontains=query) | Q(email__icontains=query) | Q(phone__icontains=query)
        )[:limit]

        sales = Sale.objects.filter(
            Q(invoice_number__icontains=query)
        )[:limit]

        # Extend with purchase orders when ready:
        # purchase_orders = PurchaseOrder.objects.filter(po_number__icontains=query)[:limit]

        return {
            "products": products,
            "customers": customers,
            "sales": sales,
            "purchase_orders": [],
        }