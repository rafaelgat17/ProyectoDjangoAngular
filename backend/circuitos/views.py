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
    try:
        # Obtener datos del request
        bloque_id = request.data.get('bloque', '1')
        
        # AQUÍ irá tu librería
        # Por ahora simulamos que generamos una imagen
        
        # Tu librería probablemente devuelva algo como:
        # imagen = tu_libreria.generar_circuito(filas=2, columnas=3)
        
        # Para testing, devolvemos datos de ejemplo
        return Response({
            'mensaje': 'Circuito generado exitosamente',
            'bloque': bloque_id,
            'datos': {
                'filas': 2,
                'columnas': 3,
                'componentes': ['Resistencia', 'Condensador', 'LED']
            }
            # Cuando tengas la imagen real, devolverás algo como:
            # 'imagen_base64': imagen_en_base64
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)