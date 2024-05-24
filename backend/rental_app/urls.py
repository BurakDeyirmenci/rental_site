from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'products', ProductViewSet)
router.register(r'rentals', RentalViewSet)
router.register(r'brands', BrandViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'product_models', ProductModelViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', get_user_info, name='get_user_info'),
    path('search/', search_products, name='search_products'),
    path('featured/', featured_products, name='featured_products'),
    path('my-rentals/', my_rentals, name='my_rentals'),
    path('', include(router.urls)),
]
