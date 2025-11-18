from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
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


def determinar_tipo_nodo(row, col, total_rows, total_cols):
    es_primera_fila = (row == 0)
    es_ultima_fila = (row == total_rows - 1)
    es_primera_col = (col == 0)
    es_ultima_col = (col == total_cols - 1)
    
    if es_primera_fila and es_primera_col:
        return 'corner-top-left'
    if es_primera_fila and es_ultima_col:
        return 'corner-top-right'
    if es_ultima_fila and es_primera_col:
        return 'corner-bottom-left'
    if es_ultima_fila and es_ultima_col:
        return 'corner-bottom-right'
    
    if es_primera_fila:
        return 'edge-top'
    if es_ultima_fila:
        return 'edge-bottom'
    if es_primera_col:
        return 'edge-left'
    if es_ultima_col:
        return 'edge-right'
    
    return 'center'

# Esto determina exactamente que tipo de nodo generar, las esquinas, o el centro si es que el circuito tiene.

def calcular_posicion_etiqueta(source_row, source_col, target_row, target_col, total_rows, total_cols, orientation):
    mid_row = (source_row + target_row) / 2.0
    mid_col = (source_col + target_col) / 2.0
    
    es_borde_superior = (mid_row < 0.5)
    es_borde_inferior = (mid_row > total_rows - 1.5)
    es_borde_izquierdo = (mid_col < 0.5)
    es_borde_derecho = (mid_col > total_cols - 1.5)
    
    if es_borde_superior:
        return 'outside-top'
    if es_borde_inferior:
        return 'outside-bottom'
    if es_borde_izquierdo:
        return 'outside-left'
    if es_borde_derecho:
        return 'outside-right'
    
    if orientation == 'horizontal':
        return 'inside-bottom'
    else:
        return 'inside-right'

# Esto determina la posicion concreta de las etiquetas teniendo en cuenta la posicion del componente.

@api_view(['POST'])
def generar_circuito(request):
    try:
        if request.method == 'GET':
            bloque_id = '1'
            rows = 2
            cols = 3
        else:
            bloque_id = request.data.get('bloque', '1')
            rows = request.data.get('rows', 2)
            cols = request.data.get('cols', 3)
        
        circuito = lib.circuit(rows=rows, cols=cols)
        
        nodos = []
        for node in circuito.nodes:
            idx = int(node[1])
            jdx = int(node[2])
            
            node_type = determinar_tipo_nodo(idx, jdx, rows, cols)
            
            nodos.append({
                'id': node,
                'row': idx,
                'col': jdx,
                'type': node_type
            })
        
        componentes = []
        comp_id = 0
        
        for e in circuito.edges:
            source = e[0]
            target = e[1]
            
            source_row = int(source[1])
            source_col = int(source[2])
            target_row = int(target[1])
            target_col = int(target[2])
            
            if source_row == target_row:
                orientation = 'horizontal'
            else:
                orientation = 'vertical'

            # Esto determina si los nodos van:
            # Seguidos (vertical)
            # Uno abajo del otro (horizontal)
            
            label_position = calcular_posicion_etiqueta(source_row, source_col, target_row, target_col, rows, cols, orientation)
            
            element = circuito.G[source][target]['element']
            string_val = circuito.G[source][target].get('string')
            
            componentes.append({
                'id': f'comp-{comp_id}',
                'source': source,
                'target': target,
                'type': element,
                'value': string_val,
                'orientation': orientation,
                'labelPosition': label_position
            })
            comp_id += 1
        
        return Response({
            'success': True,
            'mensaje': 'Circuito generado exitosamente',
            'bloque': bloque_id,
            'circuito': {
                'rows': rows,
                'cols': cols,
                'nodos': nodos,
                'componentes': componentes
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'mensaje': 'Error al generar el circuito'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
