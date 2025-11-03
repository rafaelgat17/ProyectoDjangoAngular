from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_connection, name="test"),
    path('generar-circuito/', views.generar_circuito, name='generar-circuito'),
]

# Si llega una peticion a api/circuitos/test, finalmente se dirigira aqui,
# y ejecutara la funcion test_connections que se encuentra en views.py de la app circuitos,
# en caso de que fuese api/circuitos/generar_circuito, pues hara lo mismo.