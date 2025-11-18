import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-circuit-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circuit-viewer.component.html',
  styleUrl: './circuit-viewer.component.css'
})
export class CircuitViewerComponent implements OnChanges {
  @Input() circuitData: any;  // Datos que llegan del componente padre
  
  // Configuración del grid
  readonly CELL_SIZE = 200;  // Tamaño de cada celda en píxeles
  readonly NODE_RADIUS = 18;  // Radio de los círculos de nodos
  
  // Tamaño del SVG
  svgWidth = 0;
  svgHeight = 0;
  
  // Datos procesados
  nodos: Nodo[] = [];
  componentes: Componente[] = [];

  // Este método se ejecuta cada vez que cambia circuitData
  ngOnChanges(changes: SimpleChanges) {
    if (changes['circuitData'] && this.circuitData) {
      this.processCircuitData();
    }
  }

  // Procesar los datos del circuito
  processCircuitData() {
    this.nodos = this.circuitData.nodos || [];
    this.componentes = this.circuitData.componentes || [];
    
    // Calcular tamaño del SVG
    const rows = this.circuitData.rows || 2;
    const cols = this.circuitData.cols || 3;
    
    // Añadir margen para etiquetas externas
    const margin = 80;
    this.svgWidth = (cols + 1) * this.CELL_SIZE + margin * 2;
    this.svgHeight = (rows + 1) * this.CELL_SIZE + margin * 2;
  }

  // Calcular posición X de un nodo
  getNodeX(col: number): number {
    return 80 + (col + 0.5) * this.CELL_SIZE;
  }

  // Calcular posición Y de un nodo
  getNodeY(row: number): number {
    return 80 + (row + 0.5) * this.CELL_SIZE;
  }

  // Obtener el nodo por su ID
  getNode(nodeId: string): Nodo | undefined {
    return this.nodos.find(n => n.id === nodeId);
  }

  // Calcular punto medio de un componente
  getComponentMidPoint(comp: Componente): {x: number, y: number} {
    const sourceNode = this.getNode(comp.source);
    const targetNode = this.getNode(comp.target);
    
    if (!sourceNode || !targetNode) {
      return {x: 0, y: 0};
    }
    
    const x1 = this.getNodeX(sourceNode.col);
    const y1 = this.getNodeY(sourceNode.row);
    const x2 = this.getNodeX(targetNode.col);
    const y2 = this.getNodeY(targetNode.row);
    
    return {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2
    };
  }

  // Calcular rotación del componente (0° o 90°)
  getComponentRotation(comp: Componente): number {
    return comp.orientation === 'vertical' ? 90 : 0;
  }

  // Calcular posición de la etiqueta
  getLabelPosition(comp: Componente): {x: number, y: number} {
    const mid = this.getComponentMidPoint(comp);
    const offset = 40;
    
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

  // Obtener color según el tipo de componente
  getComponentColor(type: string): string {
    const colors: {[key: string]: string} = {
      'resistor': '#E74C3C',
      'capacitor': '#3498DB',
      'inductor': '#9B59B6',
      'v_source': '#F39C12',
      'c_source': '#1ABC9C',
      'shortcircuit': '#95A5A6',
      'opencircuit': '#BDC3C7'
    };
    return colors[type] || '#34495E';
  }

  // Obtener símbolo del componente (por ahora texto, luego SVG)
  getComponentSymbol(type: string): string {
    const symbols: {[key: string]: string} = {
      'resistor': 'R',
      'capacitor': 'C',
      'inductor': 'L',
      'v_source': 'V',
      'c_source': 'I',
      'shortcircuit': '—',
      'opencircuit': '◦'
    };
    return symbols[type] || '?';
  }
} 