import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// Input es un decorador que permite recibir datos del componente padre
// OnChanges se utilizara para detectar cambios en los datos de entrada
// SimpleChanges es un tipo que contiene informacion acerca de que datos exactos son los que cambiaron en el input

// CommonModule da acceso a Angular como *ngIf, *ngFor y otras mas

interface Nodo {
  id: string;
  row: number;
  col: number;
  type: string;
}

// el tipo del nodo sera la ubicacion de este, corner-top-left, corner-bottom-rigth

interface Componente {
  id: string;
  source: string;
  target: string;
  type: string;
  value: string | null;
  orientation: string;
  labelPosition: string;
}

// Aqui se definen la estructura de los objetos Nodo y Componente





@Component({
  selector: 'app-circuit-viewer',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './circuit-viewer.component.html',
  styleUrl: './circuit-viewer.component.css'
})

// Datos del componente

export class CircuitViewerComponent implements OnChanges {
  @Input() circuitData: any;

  // recibe el objeto completo del circuito generado por el backend
  
  public readonly CELL_SIZE = 200;
  public readonly NODE_RADIUS = 18;
  public readonly MARGIN = 80;

  // readonly es una constante, no se puede editar
  // son constantes y publicas para que puedan ser leidas en el html
  // cell_size es la distancia en pixeles entre dos nodos
  // margin es el espacio del borde alrededor del circuito
  
  imgWidth = 0;
  imgHeight = 0;

  // vendria siendo las dimensiones finales del circuito, se calcula luego en processCircuitData()
  
  nodos: Nodo[] = [];
  componentes: Componente[] = [];

  // Propiedades de estado: Almacenan los datos de nodos y componentes extraídos y tipados para ser usados en los métodos.





  ngOnChanges(changes: SimpleChanges) {
    if (changes['circuitData'] && this.circuitData) {
      this.processCircuitData();
    }
    
    // ngonchanges se ejecuta cada vez que input cambia de valor en circuitdata
    // comprueba que haya cambiado circuitdata y que ademas tiene un valor 
    // si es asi llama a la funcion processCircuitData

  }

  // ngOnInit() se ejecuta una vez
  // ngOnChanges() se ejecuta cada vez que @Input cambia
  // ngOnDestroy() se ejecuta cada vez que se destruye el componente

  processCircuitData() {
    this.nodos = this.circuitData.nodos || [];
    this.componentes = this.circuitData.componentes || [];
    
    // asigna los arrays de nodos y componentes a las propiedades locales, si el objeto esta vacio, usa un array vacio

    const rows = this.circuitData.rows || 2;
    const cols = this.circuitData.cols || 3;

    // Si no se cambian las dimensiones se usan las de por defecto

    const marginX = this.MARGIN + (cols > 4 ? 20 : 0);
    const marginY = this.MARGIN + (rows > 3 ? 20 : 0);

    // añade 20 pixeles extra al margin para circuitos mas grandes que 4x3
    
    this.imgWidth = (cols + 1) * this.CELL_SIZE + marginX * 2;
    this.imgHeight = (rows + 1) * this.CELL_SIZE + marginY * 2;

    // Cálculo de Tamaño SVG: Define el tamaño total del SVG. La fórmula es:
    // (Número de celdas + 1) * CELL_SIZE + (Margen ajustado * 2)
    // Se suma 1 a rows/cols porque el dibujo incluye la celda final

  }





  getNodeX(col: number): number {
    return this.MARGIN + (col + 0.5) * this.CELL_SIZE;
  }

  getNodeY(row: number): number {
    return this.MARGIN + (row + 0.5) * this.CELL_SIZE;
  }

  // 80 es el margen inicial
  // col numero de la columna (0, 1, 2)
  // 0.5 para centrar
  // this.CELL_SIZE tamaño de la celda

  // margin desplaza el circuito del borde superior/izquierdo para centrarlo
  // (col/row + 0.5): Centra el nodo dentro de la celda de la cuadrícula
  // CELL_SIZE: Aplica la escala

  getNode(nodeId: string): Nodo | undefined {
    return this.nodos.find(n => n.id === nodeId);
  }

  // Busca un nodo en el array por su ID para encontrar las coordenadas de inicio y fin del componente







  getComponentMidPoint(comp: Componente): {x: number, y: number} {
    const sourceNode = this.getNode(comp.source);
    const targetNode = this.getNode(comp.target);
    
    // Calcula el punto medio entre dos nodos para colocar el componente ahí.
    
    if (!sourceNode || !targetNode) {
      return {x: 0, y: 0};
    }

    // si sourceNode o targetNode es falsy...
    
    const x1 = this.getNodeX(sourceNode.col); // posicion x del nodo origen
    const y1 = this.getNodeY(sourceNode.row); // posicion y del nodo origen
    const x2 = this.getNodeX(targetNode.col); // posicion x del nodo destino
    const y2 = this.getNodeY(targetNode.row); // posicion y dle nodo destino
    
    return {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2
    };
  }

  // calcula el punto exacto, en este caso el centro, donde debe dibujarse la imagen del componente o la etiqueta
  // se promedia las coordenadas X e Y del nodo origen y del nodo destino

  getComponentRotation(comp: Componente): number {
    return comp.orientation === 'vertical' ? 90 : 0;
  }

  // Devuelve el angulo de rotacion para el componente, basandose en el campo orientation envaido por el backend

  getLabelPosition(comp: Componente): {x: number, y: number} {
    const mid = this.getComponentMidPoint(comp);
    // se obtiene el centro del componente
    const offset = 40;
    // distancia en pixeles desde el componente hasta la etiqueta
    
    switch(comp.labelPosition) {
      case 'outside-top':
        return {x: mid.x, y: mid.y - offset - 20};
      case 'outside-bottom':
        return {x: mid.x, y: mid.y + offset + 20};
      case 'outside-left':
        return {x: mid.x - offset - 30, y: mid.y};
      case 'outside-right':
        return {x: mid.x + offset + 30, y: mid.y};
      case 'inside-bottom':
        return {x: mid.x, y: mid.y + offset};
      case 'inside-right':
        return {x: mid.x + offset, y: mid.y};
      default:
        return {x: mid.x + offset, y: mid.y};
    }
  }

  // getLabelPosition: Calcula las coordenadas X/Y finales para colocar la etiqueta de valor del componente.

  // Calcula donde poner la etiqueta con el valor






getComponentImgPath(type: string): string {
  const paths: {[key: string]: string} = {
    'resistor': 'assets/components/resistor.png',
    'capacitor': 'assets/components/capacitor.png',
    'inductor': 'assets/components/inductor.png',
    'v_source': 'assets/components/v_source.png',
    'c_source': 'assets/components/c_source.png',
    'shortcircuit': 'assets/components/shortcircuit.png',
    'opencircuit': 'assets/components/opencircuit.png'
  };
  return paths[type] || 'assets/components/resistor.png';
}

getNodeImgPath(type: string): string {
  const paths: {[key: string]: string} = {
    'corner-top-left': 'assets/nodes/corner-top-left.png',
    'corner-top-right': 'assets/nodes/corner-top-right.png',
    'corner-bottom-left': 'assets/nodes/corner-bottom-left.png',
    'corner-bottom-right': 'assets/nodes/corner-bottom-right.png',
    'edge-top': 'assets/nodes/edge-top.png',
    'edge-bottom': 'assets/nodes/edge-bottom.png',
    'edge-left': 'assets/nodes/edge-left.png',
    'edge-right': 'assets/nodes/edge-right.png',
    'center': 'assets/nodes/center.png'
  };
  return paths[type] || 'assets/nodes/center.png';
}
} 