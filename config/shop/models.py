from django.conf import settings
from django.db import models
from django.contrib.auth.models import User

# shop/models.py
class Category(models.Model):
    name = models.CharField("Название категории", max_length=100)

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField("Название тега", max_length=50)
    color = models.CharField("Цвет", max_length=20, default="bg-gray-500")  # для Tailwind CSS

    class Meta:
        verbose_name = "Тег"
        verbose_name_plural = "Теги"

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField("Название", max_length=255)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        verbose_name="Категория",
        related_name="products"
    )
    description = models.TextField("Описание")
    company = models.CharField("Компания", max_length=255, blank=True)
    price = models.DecimalField("Цена", max_digits=10, decimal_places=2)
    image = models.URLField("Ссылка на изображение", blank=True)
    count = models.DecimalField("В наличии", max_digits=10, decimal_places=2, blank=True)
    original_price = models.DecimalField("Оригинальная цена", max_digits=10, decimal_places=2, blank=True, null=True)
    color = models.CharField("Цвет", max_length=255, blank=True)
    storage = models.CharField("Память", max_length=255, blank=True)
    tags = models.ManyToManyField(Tag, blank=True, verbose_name="Теги")
    in_stock = models.BooleanField("Скрыть", default=True)

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"

    def __str__(self):
        return self.name

    def average_rating(self):
        ratings = self.ratings.all()
        return sum([r.stars for r in ratings]) / ratings.count() if ratings else 0

class Rating(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stars = models.PositiveIntegerField("Оценка", choices=[(i, str(i)) for i in range(1, 6)])

    class Meta:
        unique_together = ('product', 'user')  # 1 пользователь может 1 раз оценить

class KeyFeature(models.Model):
    product = models.ForeignKey("Product", related_name="key_features", on_delete=models.CASCADE)
    text = models.TextField("Ключевые особенности", blank=True)

    class Meta:
        verbose_name = "Ключевая особенность"
        verbose_name_plural = "Ключевые особенности"

class Specification(models.Model):
    product = models.ForeignKey("Product", related_name="specifications", on_delete=models.CASCADE)
    name = models.CharField("Имя", max_length=100)   # Например, "Процессор"
    value = models.CharField("Характиристика", max_length=255)  # Например, "Snapdragon 8 Gen 2"

    class Meta:
        verbose_name = "Характеристика"
        verbose_name_plural = "Характеристики"

    def __str__(self):
        return self.name




