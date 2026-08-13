from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from users.views import MyTokenObtainPairView, ForgotPasswordView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Global Authentication APIs
    path('api/auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Keep your token refresh route exactly the same:
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # App Specific Routers
    path('api/users/', include('users.urls')),
    path('api/products/', include('products.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/customers/', include('customers.urls')),
    path('api/sales/', include('sales.urls')),
    path('api/purchase-orders/', include('purchase_orders.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/core/', include('core.urls')),
]

# Serves uploaded media files (like your product images) during local development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)