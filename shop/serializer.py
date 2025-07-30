from rest_framework import serializers
from .models import Product, Tag, Category, KeyFeature, Specification


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'color']

class KeyFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyFeature
        fields = ['text']

class SpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specification
        fields = ['name', 'value']

class ProductSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    key_features = KeyFeatureSerializer(many=True, read_only=True)
    specifications = SpecificationSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        features_data = validated_data.pop('key_features', [])
        product = Product.objects.create(**validated_data)
        for feature in features_data:
            KeyFeature.objects.create(product=product, **feature)
        return product

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'product_count']
