from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import base64
import io
import matplotlib
matplotlib.use('Agg')  # IMPORTANTE: usar backend sin interfaz gráfica
import matplotlib.pyplot as plt

# Importar tu librería
from .circuitlib import lib

@api_view(['GET'])
def test_connection(request):
    return Response({'message': 'Conexión exitosa con Django'})

@api_view(['POST'])
def generar_circuito(request):
    try:
        # Obtener parámetros del request
        bloque_id = request.data.get('bloque', '1')
        rows = request.data.get('rows', 2)  # Por defecto 2 filas
        cols = request.data.get('cols', 3)  # Por defecto 3 columnas
        seed = request.data.get('seed', None)  # Seed opcional para reproducibilidad
        
        # Crear el circuito
        circuito = lib.circuit(rows=rows, cols=cols, seed=seed)
        
        # Dibujar el circuito
        circuito.draw()
        
        # Guardar la figura en un buffer de memoria (sin guardar archivo)
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=150, bbox_inches='tight')
        buffer.seek(0)  # Volver al inicio del buffer
        
        # Convertir a Base64
        imagen_base64 = base64.b64encode(buffer.read()).decode('utf-8')
        
        # Cerrar la figura para liberar memoria
        plt.close()
        
        # Preparar información del circuito
        nodos = circuito.nodes
        num_componentes = len(circuito.edges)
        
        return Response({
            'success': True,
            'mensaje': 'Circuito generado exitosamente',
            'bloque': bloque_id,
            'circuito': {
                'rows': rows,
                'cols': cols,
                'num_nodos': len(nodos),
                'num_componentes': num_componentes,
                'imagen': f'data:image/png;base64,{imagen_base64}'  # Formato para <img src="">
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'mensaje': 'Error al generar el circuito'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)