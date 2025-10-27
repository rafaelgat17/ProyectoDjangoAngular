from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

@api_view(['GET'])
def test_connection(request):
    return Response ({'message': 'Conexion exitosa con Django'})

@api_view(['POST'])
def generar_circuito(request):
    # Aqui ira tu logica con la libreria de tu tutor
    # Por ahora devolvemos algo basico
    return Response ({
        'mensaje': 'Circuito generado',
        'datos': 'Aqui ira la imagen del circuito'
    })