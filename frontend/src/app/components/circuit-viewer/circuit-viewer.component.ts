import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// Input es un decorador que permite recibir datos del componente padre
// OnChanges se utilizara para detectar cambios en los datos de entrada
// SimpleChanges es un tipo que contiene informacion acerca de que datos exactos son los que cambiaron

// CommonModule da acceso a Angular como *ngIf, *ngFor y otras mas

interface Nodo {
  id: string;
  row: number;
  col: number;
  type: string;
}

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

  // Recibe los datos del padre
  
  readonly CELL_SIZE = 200;
  readonly NODE_RADIUS = 18;
  readonly MARGIN = 80;

  // readonly es una constante, no se puede editar
  // CELL_SIZE representaria el tamaño de cada celda de la cuadricula en px
  
  imgWidth = 0;
  imgHeight = 0;

  // tamaño de la imagen el cual se calcula despues
  
  nodos: Nodo[] = [];
  componentes: Componente[] = [];

  // son arrays vacios que contendran los nodos y los componentes

  ngOnChanges(changes: SimpleChanges) {
    if (changes['circuitData'] && this.circuitData) {
      this.processCircuitData();
    }
    
    // Si cambio circuitData Y si circuitData tiene valor entonces se procesan los datos

  }

  // ngOnInit() se ejecuta una vez
  // ngOnChanges() se ejecuta cada vez que @Input cambia
  // ngOnDestroy() se ejecuta cada vez que se destruye el componente

  processCircuitData() {
    this.nodos = this.circuitData.nodos || [];
    this.componentes = this.circuitData.componentes || [];
    
    // Si lo de la izquierda es falsy usa lo de la derecha

    const rows = this.circuitData.rows || 2;
    const cols = this.circuitData.cols || 3;

    // Si no se cambian las dimensiones se usan las de por defecto

    const marginX = this.MARGIN + (cols > 4 ? 20 : 0);
    const marginY = this.MARGIN + (rows > 3 ? 20 : 0);
    
    this.imgWidth = (cols + 1) * this.CELL_SIZE + marginX * 2;
    this.imgHeight = (rows + 1) * this.CELL_SIZE + marginY * 2;

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

  getNode(nodeId: string): Nodo | undefined {
    return this.nodos.find(n => n.id === nodeId);
  }

  // Busca un nodo en el array por su ID

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

  getComponentRotation(comp: Componente): number {
    return comp.orientation === 'vertical' ? 90 : 0;
  }

  // Devuelve el angulo de rotacion para el componente

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