from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_connection, name="test"),
    path('generar-circuito/', views.generar_circuito, name='generar-circuito'),
]