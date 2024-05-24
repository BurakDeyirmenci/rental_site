from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Rental, Brand,Category, ProductModel
from django.contrib.auth import authenticate

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        if username and password:
            user = authenticate(username=username, password=password)
            if user is None:
                raise serializers.ValidationError("Invalid login credentials")
        else:
            raise serializers.ValidationError("Must include 'username' and 'password'")

        data["user"] = user
        return data
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductModel
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    brand = BrandSerializer()
    product_model = ProductModelSerializer()
    category = CategorySerializer()

    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        brand_data = validated_data.pop('brand')
        product_model_data = validated_data.pop('product_model')
        category_data = validated_data.pop('category')

        brand = Brand.objects.get_or_create(**brand_data)[0]
        product_model = ProductModel.objects.get_or_create(**product_model_data)[0]
        category = Category.objects.get_or_create(**category_data)[0]

        product = Product.objects.create(brand=brand, product_model=product_model, category=category, **validated_data)
        return product

    def update(self, instance, validated_data):
        brand_data = validated_data.pop('brand')
        product_model_data = validated_data.pop('product_model')
        category_data = validated_data.pop('category')

        instance.brand = Brand.objects.get_or_create(**brand_data)[0]
        instance.product_model = ProductModel.objects.get_or_create(**product_model_data)[0]
        instance.category = Category.objects.get_or_create(**category_data)[0]

        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.price = validated_data.get('price', instance.price)
        instance.weight = validated_data.get('weight', instance.weight)
        instance.image_url = validated_data.get('image_url', instance.image_url)

        instance.save()
        return instance

class RentalSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)

    class Meta:
        model = Rental
        fields = '__all__'

    def create(self, validated_data):
        user = validated_data.pop('user')
        product = validated_data.pop('product')
        rental = Rental.objects.create(user=user, product=product, **validated_data)
        return rental

    def update(self, instance, validated_data):
        print(validated_data)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
