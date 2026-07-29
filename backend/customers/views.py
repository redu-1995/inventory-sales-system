import csv
from decimal import Decimal
from django.http import HttpResponse
from django.db.models import Sum, Q, F, ExpressionWrapper, DecimalField
from django.db.models.functions import Coalesce
from rest_framework import status, filters
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Customer
from .serializers import CustomerSerializer
from sales.serializers import SaleSerializer


class CustomerViewSet(ModelViewSet):
    """
    Handles CRUD operations, search, filters, export, and detailed analytics for Customers.
    """
    queryset = Customer.objects.prefetch_related('sales', 'sales__payments').all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    # Filtering, Searching & Ordering setup
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['full_name', 'phone', 'email']
    ordering_fields = ['created_at', 'full_name']
    ordering = ['-created_at']

    # ==========================================
    # 1. Overall Customer KPI Metrics
    # ==========================================
    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """
        Returns summary metrics for CustomerStats UI header card.
        Route: GET /api/customers/stats/
        """
        total_customers = Customer.objects.count()
        active_customers = Customer.objects.filter(status='ACTIVE').count()

        # Calculate metrics using sales table
        sales_agg = Customer.objects.aggregate(
            grand_spent=Coalesce(
                Sum('sales__total_amount', filter=~Q(sales__status__iexact='CANCELLED')),
                Decimal('0.00')
            )
        )

        # Outstanding balance across all unpaid sales
        pending_sales = Customer.objects.filter(
            Q(sales__status__iexact='UNPAID') | Q(sales__status__iexact='PARTIAL') | Q(sales__status__iexact='PENDING')
        ).annotate(
            paid_amount=Coalesce(
                Sum('sales__payments__amount'),
                Decimal('0.00'),
                output_field=DecimalField()
            )
        )

        balance_expr = ExpressionWrapper(
            F('sales__total_amount') - F('paid_amount'),
            output_field=DecimalField()
        )

        total_outstanding = pending_sales.aggregate(
            due=Coalesce(Sum(balance_expr), Decimal('0.00'))
        )['due']

        return Response({
            'total_customers': total_customers,
            'active_customers': active_customers,
            'total_revenue': float(sales_agg['grand_spent']),
            'outstanding_debt': float(total_outstanding),
        }, status=status.HTTP_200_OK)

    # ==========================================
    # 2. Customer Purchase History Action
    # ==========================================
    @action(detail=True, methods=['get'], url_path='sales')
    def purchase_history(self, request, pk=None):
        """
        Returns full list of sales completed by a specific customer.
        Route: GET /api/customers/{id}/sales/
        """
        customer = self.get_object()
        sales = customer.sales.all().order_by('-sale_date')
        serializer = SaleSerializer(sales, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ==========================================
    # 3. Dedicated Customer Balance Endpoint
    # ==========================================
    @action(detail=True, methods=['get'], url_path='balance')
    def balance(self, request, pk=None):
        """
        Returns remaining unpaid balance for a specific customer.
        Route: GET /api/customers/{id}/balance/
        """
        customer = self.get_object()
        serializer = self.get_serializer(customer)
        return Response({
            "customer": customer.full_name,
            "balance": serializer.data["outstanding_balance"]
        }, status=status.HTTP_200_OK)

    # ==========================================
    # 4. Export CSV Action
    # ==========================================
    @action(detail=False, methods=['get'], url_path='export')
    def export_customers(self, request):
        """
        Exports filtered customer list to a downloadable CSV file.
        Route: GET /api/customers/export/
        """
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="customers_report.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Full Name', 'Phone', 'Email', 'Address', 
            'Status', 'Total Orders', 'Total Spent', 'Outstanding Balance', 'Created At'
        ])

        # Apply active query filters to export data
        queryset = self.filter_queryset(self.get_queryset())

        for customer in queryset:
            serializer = self.get_serializer(customer)
            data = serializer.data
            writer.writerow([
                customer.id,
                customer.full_name,
                customer.phone,
                customer.email or 'N/A',
                customer.address or 'N/A',
                customer.status,
                data['total_orders'],
                data['total_spent'],
                data['outstanding_balance'],
                customer.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])

        return response