# notifications/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet

router = DefaultRouter()
router.register(r'', NotificationViewSet, basename='notification')

# Must be exact variable name 'urlpatterns' defined as a list [...]
urlpatterns = [
    path('', include(router.urls)),
]