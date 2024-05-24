from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Product, Rental,Brand, Category, ProductModel
from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, filters
from rest_framework.response import Response
from rest_framework.views import APIView

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"user": RegisterSerializer(user).data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response(status=status.HTTP_200_OK)
        except AttributeError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'is_staff': user.is_staff,
    })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductModelViewSet(viewsets.ModelViewSet):
    queryset = ProductModel.objects.all()
    serializer_class = ProductModelSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['brand', 'product_model', 'category']
    search_fields = ['brand', 'product_model', 'category']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, permissions.IsAdminUser]
        return super(self.__class__, self).get_permissions()

class RentalViewSet(viewsets.ModelViewSet):
    queryset = Rental.objects.all()
    serializer_class = RentalSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['product', 'user']
    search_fields = ['product', 'user']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated]
        return super(self.__class__, self).get_permissions()

@api_view(['GET'])
def search_products(request):
    query = request.GET.get('query', '')
    if query:
        products = Product.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    return Response({"message": "No query provided."}, status=400)

@api_view(['GET'])
def featured_products(request):
    products = Product.objects.all()[:4]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_rentals(request):
    user = request.user
    filters = request.query_params
    print(filters)
    if user.is_staff:  # Admin kontrolü
        rentals = Rental.objects.all()
    else:
        rentals = Rental.objects.filter(user=user)

    if 'product_brand' in filters:
        rentals = rentals.filter(product__brand__id=filters['product_brand'])
    
    if 'product_model' in filters:
        rentals = rentals.filter(product__product_model__id=filters['product_model'])
    
    if 'category' in filters:
        rentals = rentals.filter(product__category__id=filters['category'])
    
    serializer = RentalSerializer(rentals, many=True)
    return Response(serializer.data)
