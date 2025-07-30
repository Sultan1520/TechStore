from rest_framework import viewsets, generics
from .models import Product
from .serializer import ProductSerializer, CategorySerializer, KeyFeatureSerializer
from .models import Category
from django.db.models import Count

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.annotate(product_count=Count('products'))
    serializer_class = CategorySerializer

class KeyFeatureSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = KeyFeatureSerializer
