import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CircuitosService } from '../../services/circuitos.service';
import { CircuitViewerComponent } from '../circuit-viewer/circuit-viewer.component';

// OnInit: ngOnInit() se ejecuta cuando el componente se inicializa.
// FormsModule: necesario para usar [(ngModel)].
// ActivatedRoute: para leer parametros de la URL (:id).
// CircuitosService: el servicio para hablar con Django.

@Component({
  selector: 'app-bloque',
  standalone: true,
  imports: [CommonModule, FormsModule, CircuitViewerComponent],
  templateUrl: './bloque.component.html',
  styleUrl: './bloque.component.css'
})
export class BloqueComponent implements OnInit {
  bloqueId: string = ''; // guarda el id del bloque actual capturado en la URL.
  circuitoGenerado: any = null; // guardara la respuesta de Django que sera el JSON con la imagen.
  cargando: boolean = false; // esto mostrara u ocultara el icono de cargando.
  
  // parametros predeterminados del circuito
  rows: number = 2;
  cols: number = 3;

  constructor(
    private route: ActivatedRoute, // para leer la URL
    private circuitosService: CircuitosService // para hacer peticiones a Django.
  ) {}

  ngOnInit() { // se ejecuta cada vez que se crea el componente
    this.route.params.subscribe(params => { // Subscribe seria como para que avisase de que se actualiza un valor
      this.bloqueId = params['id']; // si se va a /bloque/3, params['id']
    });
  }



  generarEjercicio() {
    this.cargando = true; // activa el cargando
    this.circuitoGenerado = null; // limpia el circuito anterior
    
    const datos = { // crea el objeto
      bloque: this.bloqueId,
      rows: this.rows,
      cols: this.cols
    };
    
    this.circuitosService.generarCircuito(datos) // llama al servicio (que devuelve un observable) 
      .subscribe({
        next: (respuesta) => { // se ejecuta cuando django responde bien
          console.log('Respuesta del servidor:', respuesta);
          this.circuitoGenerado = respuesta;
          this.cargando = false;
        },
        error: (error) => { // se ejecuta si algo falla
          console.error('Error al generar circuito:', error);
          alert('Error al generar el circuito. Revisa la consola.');
          this.cargando = false;
        }
      });
  }
}