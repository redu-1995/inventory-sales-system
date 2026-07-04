from rest_framework.viewsets import ModelViewSet
from django.http import HttpResponse
from django.db import models
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import csv
import io
from django.db import transaction
import openpyxl
from .models import Product, Category
from inventory.models import Inventory


from .models import Category, Supplier, Product
from .serializers import (
    CategorySerializer,
    SupplierSerializer,
    ProductSerializer,
)


class CategoryViewSet(ModelViewSet):
    """
    Handles CRUD operations for Categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer



class SupplierViewSet(ModelViewSet):
    """
    Handles CRUD operations for Suppliers.
    """
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    


class ProductViewSet(ModelViewSet):
    """
    Handles CRUD operations for Products.
    """
    queryset = Product.objects.select_related(
        "category",
        "supplier"
    ).all()

    serializer_class = ProductSerializer
  
class ProductExportView(APIView):
    
    def get(self, request):
        # 1. Start with the baseline query scope
        queryset = Product.objects.select_related("category", "supplier").prefetch_related("inventory").all()
        
        # 2. Extract and evaluate active URL query parameters from the client
        search_query = request.query_params.get('search', None)
        category_name = request.query_params.get('category', None)
        stock_status = request.query_params.get('stock_status', None)

        # 3. Apply identical matching logic filters sequentially
        if search_query:
            queryset = queryset.filter(name__icontains=search_query)
        if category_name:
            queryset = queryset.filter(category__name=category_name)
        if stock_status == 'LOW_STOCK':
            queryset = queryset.filter(inventory__quantity__gt=0, inventory__quantity__lte=models.F('inventory__reorder_level'))
        elif stock_status == 'OUT_OF_STOCK':
            queryset = queryset.filter(inventory__quantity=0)

        # 4. Generate the openpyxl spreadsheet payload out of the remaining results
        workbook = openpyxl.Workbook()
        worksheet = workbook.active
        worksheet.title = "Inventory Status"
        
        # Write Columns headers cleanly
        worksheet.append(["Product Name", "SKU", "Category", "Cost Price", "Selling Price", "Quantity"])
        
        for product in queryset:
            inventory = getattr(product, "inventory", None)
            quantity = getattr(inventory, "quantity", 0)
            worksheet.append([
                product.name, product.sku, product.category.name,
                product.cost_price, product.selling_price, quantity
            ])
            
        # 5. Return the document explicitly as an attachment stream
        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response['Content-Disposition'] = 'attachment; filename="export.xlsx"'
        workbook.save(response)
        return response




class ProductImportView(APIView):


    def post(self, request):
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        filename = uploaded_file.name
        rows_data = []

        # 1. Route parser according to explicit file extension formats
        try:
            if filename.endswith('.csv'):
                data_stream = io.StringIO(uploaded_file.read().decode('utf-8'))
                reader = csv.reader(data_stream)
                header = next(reader) # Skip table label headers
                for row in reader:
                    if row: 
                        rows_data.append(row)
                        
            elif filename.endswith('.xlsx'):
                workbook = openpyxl.load_workbook(uploaded_file, data_only=True)
                worksheet = workbook.active
                # Convert matrix iterator directly to standard list array
                iterator = worksheet.iter_rows(values_only=True)
                header = next(iterator) # Skip labels
                for row in iterator:
                    if any(row): # Exclude completely white/empty rows
                        rows_data.append(row)
            else:
                return Response({"error": "Unsupported file format version extensions."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Failed reading spreadsheet: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Process data inside an isolated block transaction to protect system integrity
        created_count = 0
        updated_count = 0
        validation_errors = []

        with transaction.atomic():
            for index, row in enumerate(rows_data, start=2): # Start on log tracking row index 2 
                try:
                    # Map position arrays explicitly (Assuming: Name, SKU, Category, Cost, Selling, Qty)
                    name = str(row[0]).strip()
                    sku = str(row[1]).strip()
                    category_name = str(row[2]).strip()
                    cost_price = float(row[3])
                    selling_price = float(row[4])
                    quantity = int(row[5])

                    # Fetch or build fallback structural dependencies
                    category, _ = Category.objects.get_or_create(name=category_name)

                    # 3. Perform Upsert Execution Logic via atomic verification checks
                    product, created = Product.objects.update_or_create(
                        sku=sku,
                        defaults={
                            'name': name,
                            'category': category,
                            'cost_price': cost_price,
                            'selling_price': selling_price,
                            'status': True if quantity > 0 else False
                        }
                    )

                    inventory, inventory_created = Inventory.objects.get_or_create(product=product)
                    inventory.quantity = quantity
                    inventory.save()

                    if created:
                        created_count += 1
                    else:
                        updated_count += 1

                except (IndexError, ValueError, TypeError) as error_info:
                    validation_errors.append(f"Row {index}: Structural parsing error formatting text columns. Details: {str(error_info)}")
                    continue

            # If anomalies emerge, stop execution entirely and revert changes to keep the data clean
            if validation_errors:
                transaction.set_rollback(True)
                return Response({"errors": validation_errors}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        return Response({
            "message": "Bulk import completed successfully.",
            "created_count": created_count,
            "updated_count": updated_count
        }, status=status.HTTP_200_OK)