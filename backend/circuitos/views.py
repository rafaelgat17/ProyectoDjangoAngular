from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import base64
import io
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from .circuitlib import lib

# api_view: seria un decorador el cual se coloca encima de cada funcion, y le dice a la funcion que será una API.
# En Django normal, al crear una vista, se devuelve una pagina HTML para que se vea en el navegador, pero en este caso
# si queremos crear una API, no se envia HTML, si no datos como datos JSON, que otras aplicaciones puedan leer, como en este caso Angular. 

# Response: es para devolver los datos en formato JSON.
# Status: es para los codigos HTTP.
# base64: para convertir las imagenes resultantes en texto enviable por JSON.
# io: para trabajar en memoria y no con archivos en disco.
# matplotlib.use('Agg'): matplotlib abre ventanas graficas, en un servidor no hay pantalla, y lo que hace 'Agg', es decirle que genere la
# imagen en memoria, sin ventanas.

@api_view(['GET']) # Solo responde a peticiones GET, como cuando se pone una URL.
def test_connection(request):
    return Response({'message': 'Conexión exitosa con Django'})

# Devuelve un simple mensaje en JSON.


@api_view(['POST']) # Solo responde a peticiones POST, al enviar datos.
def generar_circuito(request):
    try:
        # Se obtienen los datos de Angular.
        bloque_id = request.data.get('bloque', '1') # Se obtiene el valor de bloque que se envio desde Angular, 1 por defecto.
        rows = request.data.get('rows', 2)
        cols = request.data.get('cols', 3)

        # Se declaran los demas campos para realizar el circuito.
        
        circuito = lib.circuit(rows=rows, cols=cols)

        # Llama a la libreria lib.py y crea el circuito aleatorio con las dimensiones que se mandaron desde Angular.
        
        circuito.draw()

        # Se ejecuta el metodo draw de lib.py, crea una figura con matplotlib, pero no se ha guardado hasta que se meta en el buffer.
        
        buffer = io.BytesIO() # Se crea un contenedor de memoria vacio.
        plt.savefig(buffer, format='png', dpi=150, bbox_inches='tight') # Se guarda la imagen de matplotlib dentro del buffer.
        buffer.seek(0) # Vuelve al inicio del buffer, ya que en el caso de que no se pusiera, el puntero de lectura empezaria desde el final y no apareceria nada.

        # Se guarda en formato png, con 150 puntos por pulgada (seria la calidad de la imagen), y se recorta el espacio blanco sobrante.
        
        imagen_base64 = base64.b64encode(buffer.read()).decode('utf-8')

        # Se convierte la imagen almacenada en el buffer en formato legible para JSON.
        
        plt.close()

        # Se cierra la figura para que no haya acumulacion de figuras guardadas en memoria.
        
        nodos = circuito.nodes
        num_componentes = len(circuito.edges)
        
        return Response({
            'success': True,
            'mensaje': 'Circuito generado exitosamente',
            'bloque': bloque_id,
            'circuito': { # Objeto con la informacion del circuito
                'rows': rows,
                'cols': cols,
                'num_nodos': len(nodos),
                'num_componentes': num_componentes,
                'imagen': f'data:image/png;base64,{imagen_base64}'
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'mensaje': 'Error al generar el circuito'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Se captura la excepcion en caso de error.