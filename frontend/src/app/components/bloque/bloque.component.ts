import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CircuitosService } from '../../services/circuitos.service';

@Component({
  selector: 'app-bloque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bloque.component.html',
  styleUrl: './bloque.component.css'
})
export class BloqueComponent implements OnInit {
  bloqueId: string = '';
  circuitoGenerado: any = null;
  cargando: boolean = false;
  
  // Parámetros del circuito
  rows: number = 2;
  cols: number = 3;

  constructor(
    private route: ActivatedRoute,
    private circuitosService: CircuitosService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.bloqueId = params['id'];
    });
  }

  generarEjercicio() {
    this.cargando = true;
    this.circuitoGenerado = null;
    
    const datos = {
      bloque: this.bloqueId,
      rows: this.rows,
      cols: this.cols
    };
    
    this.circuitosService.generarCircuito(datos)
      .subscribe({
        next: (respuesta) => {
          console.log('Respuesta del servidor:', respuesta);
          this.circuitoGenerado = respuesta;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al generar circuito:', error);
          alert('Error al generar el circuito. Revisa la consola.');
          this.cargando = false;
        }
      });
  }
}