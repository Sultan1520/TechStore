# orders/urls.py
from django.urls import path
from .views import OrderViewSet

order_create = OrderViewSet.as_view({'post': 'create'})
order_list = OrderViewSet.as_view({'get': 'list'})

urlpatterns = [
    path('checkout/', order_create, name='checkout'),
    path('orders/', order_list, name='orders'),
]
