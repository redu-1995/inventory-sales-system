from decimal import Decimal

from django.db.models import DecimalField, ExpressionWrapper, F, Q, Sum
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import viewsets

from .models import (
    Inventory,
    StockMovement,
    PurchaseOrder,
    PurchaseOrderItem
)

from .serializers import (
    InventorySerializer,
    StockMovementSerializer,
    PurchaseOrderSerializer,
    PurchaseOrderItemSerializer
)


class InventoryViewSet(ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

    def get_queryset(self):
        queryset = super().get_queryset().select_related('product', 'product__category')

        search = self.request.query_params.get('search', '').strip()
        category = self.request.query_params.get('category', '').strip()
        status = self.request.query_params.get('status', '').strip()

        if search:
            queryset = queryset.filter(
                Q(product__name__icontains=search) | Q(product__sku__icontains=search)
            )

        if category:
            queryset = queryset.filter(product__category__name__icontains=category)

        if status:
            if status == 'OUT_OF_STOCK':
                queryset = queryset.filter(quantity=0)
            elif status == 'LOW_STOCK':
                queryset = queryset.filter(quantity__gt=0, quantity__lte=F('reorder_level'))
            elif status == 'IN_STOCK':
                queryset = queryset.filter(quantity__gt=F('reorder_level'))

        return queryset

    def list(self, request, *args, **kwargs):
        if request.query_params.get('summary') == 'true':
            queryset = self.filter_queryset(self.get_queryset())
            total_stock_units = queryset.aggregate(total=Sum('quantity'))['total'] or 0
            low_stock = queryset.filter(quantity__gt=0, quantity__lte=F('reorder_level')).count()
            out_of_stock = queryset.filter(quantity=0).count()
            inventory_value = queryset.aggregate(
                value=Sum(
                    ExpressionWrapper(F('quantity') * F('product__cost_price'), output_field=DecimalField())
                )
            )['value'] or Decimal('0.00')

            return Response({
                'total_stock_units': int(total_stock_units),
                'low_stock': low_stock,
                'out_of_stock': out_of_stock,
                'inventory_value': float(inventory_value),
            })

        return super().list(request, *args, **kwargs)




class StockMovementViewSet(ModelViewSet):
    """
    A viewset that provides default handling for logging and reviewing stock changes.
    All business logic for IN, OUT, and ADJUST operations runs securely within 
    the overridden StockMovementSerializer pipeline.
    """
    # Order by newest changes first so logs display correctly on dashboard UI
    queryset = StockMovement.objects.all().order_by('-created_at')
    serializer_class = StockMovementSerializer
  

    def perform_create(self, serializer):
        """
        Binds the currently authenticated user to the history row 
        automatically when a standard POST action is made.
        """
        serializer.save(user=self.request.user)


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all().order_by('-order_date')
    serializer_class = PurchaseOrderSerializer

    # Optional: ensure request is passed to serializer context for user allocation
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


class PurchaseOrderItemViewSet(ModelViewSet):
    queryset = PurchaseOrderItem.objects.all()
    serializer_class = PurchaseOrderItemSerializer

import csv
from django.http import HttpResponse
from rest_framework.decorators import action
from rest_framework.viewsets import ReadOnlyModelViewSet # or your custom Inventory ViewSet class
from rest_framework.permissions import IsAuthenticated
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from datetime import datetime

from .models import Inventory

class InventoryExportViewSet(ReadOnlyModelViewSet):
    queryset = Inventory.objects.all()
    permission_classes = [IsAuthenticated]

    # Helper method to get filtered data (ensures exports respect frontend searches/filters)
    def get_filtered_data(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        return queryset

   # ==========================================
    # 1. CSV EXPORT
    # ==========================================
    @action(detail=False, methods=['get'], url_path='export-csv')
    def export_csv(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="inventory_export_{datetime.now().strftime("%Y%m%d")}.csv"'

        writer = csv.writer(response)
        writer.writerow(['Product', 'SKU', 'Category', 'Quantity', 'Reorder Level', 'Status'])

        for item in self.get_filtered_data(request):
            # Safe threshold fallback from the Inventory model
            reorder_level = getattr(item, 'reorder_level', None) or getattr(item, 'minimum_stock_level', None) or 0
            
            if item.quantity == 0:
                status = 'OUT_OF_STOCK'
            elif item.quantity <= reorder_level:
                status = 'LOW_STOCK'
            else:
                status = 'IN_STOCK'

            writer.writerow([
                item.product.name,
                item.product.sku,
                item.product.category.name if item.product.category else 'N/A',
                item.quantity,
                reorder_level,
                status
            ])
        return response

    # ==========================================
    # 2. EXCEL EXPORT (.XLSX)
    # ==========================================
    @action(detail=False, methods=['get'], url_path='export-excel')
    def export_excel(self, request):
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename="inventory_export_{datetime.now().strftime("%Y%m%d")}.xlsx"'

        wb = Workbook()
        ws = wb.active
        ws.title = "Current Inventory"

        header_fill = PatternFill(start_color="2563EB", end_color="2563EB", fill_type="solid")
        header_font = Font(name="Arial", size=11, bold=True, color="FFFFFF")
        center_align = Alignment(horizontal="center", vertical="center")

        headers = ['Product Name', 'SKU', 'Category', 'Current Stock', 'Reorder Level', 'Status']
        ws.append(headers)

        for col_num in range(1, len(headers) + 1):
            cell = ws.cell(row=1, column=col_num)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = center_align

        for item in self.get_filtered_data(request):
            reorder_level = getattr(item, 'reorder_level', None) or getattr(item, 'minimum_stock_level', None) or 0
            
            if item.quantity == 0:
                status = 'OUT_OF_STOCK'
            elif item.quantity <= reorder_level:
                status = 'LOW_STOCK'
            else:
                status = 'IN_STOCK'

            ws.append([
                item.product.name,
                item.product.sku,
                item.product.category.name if item.product.category else 'N/A',
                item.quantity,
                reorder_level,
                status
            ])

        for col in ws.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = col[0].column_letter
            ws.column_dimensions[col_letter].width = max(max_len + 3, 12)

        wb.save(response)
        return response

    # ==========================================
    # 3. PDF REPORT (Clean & Styled)
    # ==========================================
    @action(detail=False, methods=['get'], url_path='export-pdf')
    def export_pdf(self, request):
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="inventory_report_{datetime.now().strftime("%Y%m%d")}.pdf"'

        doc = SimpleDocTemplate(response, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        story = []
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            'ReportTitle', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=24, textColor=colors.HexColor('#1E293B'), spaceAfter=10
        )
        meta_style = ParagraphStyle(
            'ReportMeta', parent=styles['Normal'], fontName='Helvetica', fontSize=10, textColor=colors.HexColor('#64748B'), spaceAfter=20
        )

        story.append(Paragraph("Inventory Valuation Report", title_style))
        story.append(Paragraph(f"Generated on: {datetime.now().strftime('%B %d, %Y')} | Scope: Complete Stock", meta_style))
        story.append(Spacer(1, 15))

        # Calculate live metrics safely
        items = self.get_filtered_data(request)
        total_items = items.count()
        
        low_stock = 0
        out_of_stock = 0
        
        for i in items:
            reorder_level = getattr(i, 'reorder_level', None) or getattr(i, 'minimum_stock_level', None) or 0
            if i.quantity == 0:
                out_of_stock += 1
            elif i.quantity <= reorder_level:
                low_stock += 1

        summary_data = [
            [Paragraph("<b>Total Items Checked</b>", styles['Normal']), Paragraph("<b>Low Stock Count</b>", styles['Normal']), Paragraph("<b>Out of Stock</b>", styles['Normal'])],
            [str(total_items), str(low_stock), str(out_of_stock)]
        ]
        summary_table = Table(summary_data, colWidths=[180, 180, 180])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F8FAFC')),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ]))
        story.append(summary_table)
        story.append(Spacer(1, 25))

        table_data = [[
            Paragraph("<b>Product</b>", styles['Normal']), 
            Paragraph("<b>SKU</b>", styles['Normal']), 
            Paragraph("<b>Category</b>", styles['Normal']), 
            Paragraph("<b>Stock</b>", styles['Normal']), 
            Paragraph("<b>Status</b>", styles['Normal'])
        ]]
        
        for item in items:
            reorder_level = getattr(item, 'reorder_level', None) or getattr(item, 'minimum_stock_level', None) or 0
            if item.quantity == 0:
                status = 'Out of Stock'
            elif item.quantity <= reorder_level:
                status = 'Low Stock'
            else:
                status = 'In Stock'
                
            table_data.append([
                Paragraph(item.product.name, styles['Normal']),
                item.product.sku,
                item.product.category.name if item.product.category else 'N/A',
                str(item.quantity),
                status
            ])

        prod_table = Table(table_data, colWidths=[160, 90, 110, 80, 100])
        prod_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#2563EB')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ]))
        story.append(prod_table)

        doc.build(story)
        return response
    
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response

from django.db.models import F
from .models import Inventory

class LowStockAlertViewSet(ViewSet):
    """
    ViewSet to handle low stock reports and alerts.
    Accessible via standard list action on the router.
    """


    def list(self, request):
        """
        GET /api/inventory/low-stock-alerts/
        Returns only the products requiring immediate attention (Quantity <= Reorder Level).
        """
        # Fetch items where quantity is less than or equal to reorder level or minimum stock level
       
        
        # Open backend/inventory/views.py and change line 332 to:
        alert_items = Inventory.objects.filter(quantity__lte=F('reorder_level'))
        results = []
        for item in alert_items.select_related('product', 'product__category'):
            qty = item.quantity
            limit = getattr(item, 'reorder_level', None) or getattr(item, 'minimum_stock_level', None) or 0
            
            # Avoid division by zero if limit is misconfigured as 0
            if limit > 0:
                percentage = (qty / limit) * 100
            else:
                percentage = 0

            # Prioritization rules
            if qty == 0 or percentage <= 50:
                priority = "Critical"  # 🔴 Critical
            else:
                priority = "Low"       # 🟡 Low

            results.append({
                "id": item.id,
                "product_name": item.product.name,
                "sku": item.product.sku,
                "quantity": qty,
                "reorder_level": limit,
                "priority": priority
            })

        # Sort results so Critical priorities bubble to the very top
        results.sort(key=lambda x: (0 if x['priority'] == 'Critical' else 1, x['quantity']))

        return Response(results)