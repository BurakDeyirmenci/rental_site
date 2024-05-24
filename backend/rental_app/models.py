from django.db import models
from django.contrib.auth.models import User

class Brand(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class ProductModel(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, default=1)  # Varsayılan brand id
    product_model = models.ForeignKey(ProductModel, on_delete=models.CASCADE, default=1)  # Varsayılan model id
    weight = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=1)  # Varsayılan kategori id
    image_url = models.URLField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.name

class Rental(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    tax_number = models.CharField(max_length=20)


    def __str__(self):
        return f"{self.user.username} - {self.product.name}"
