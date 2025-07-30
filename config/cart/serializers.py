from rest_framework import serializers
from .models import CartItem
from shop.models import Product

class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    product_title = serializers.SerializerMethodField()
    product_image = serializers.URLField(source='product.image', read_only=True)
    product_price = serializers.SerializerMethodField()

    def get_product_title(self, obj):
        return obj.product.name

    def get_product_price(self, obj):
        return obj.product.price

    def validate_product_id(self, value):
        if not Product.objects.filter(id=value).exists():
            raise serializers.ValidationError("Такого продукта не существует.")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        product = Product.objects.get(id=validated_data['product_id'])
        return CartItem.objects.create(
            user=user,
            product=product,
            quantity=validated_data['quantity']
        )

    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'product_title', 'product_image', 'product_price', 'quantity']
