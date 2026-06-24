from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Customer
from .serializers import CustomerSerializer


class CustomerViewSet(ModelViewSet):
    """
    CRUD operations for Customers
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    