import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CircuitosService } from '../../services/circuitos.service';

@Component({
  selector: 'app-bloque',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bloque.component.html',
  styleUrl: './bloque.component.css'
})

export class BloqueComponent implements OnInit {
  bloqueId: string = '';
  circuitoGenerado: any = null;
  cargando: boolean = false;

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
    
    this.circuitosService.generarCircuito({ bloque: this.bloqueId })
      .subscribe({
        next: (respuesta) => {
          console.log('Respuesta del servidor:', respuesta);
          this.circuitoGenerado = respuesta;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al generar circuito:', error);
          this.cargando = false;
        }
      });
  }
}