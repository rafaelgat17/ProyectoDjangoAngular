import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  uvus: string = '';
  email: string = '';
  grado: string = '';
  password: string = '';
  cargando: boolean = false;
  error: string = '';

  // son las propiedades del componente que se vinculan con los del html
  // directamente con ngModel, almacenan esos datos introducidos

  grados = [
    { valor: 'ing-tecnologias-industriales', nombre: 'Grado de Ingienería de Tecnologías Industriales' },
    { valor: 'ing-tecnologias-telecomunicacion', nombre: 'Grado en Ingeniería de las Tecnologías de Telecomunicación' },
    { valor: 'ing-aeroespacial', nombre: 'Grado en Ingeniería Aeroespacial' },
    { valor: 'ing-civil', nombre: 'Grado en Ingeniería Civil' },
    { valor: 'ing-quimica', nombre: 'Grado en Ingienería Química' },
    { valor: 'ing-organizacion-industrial', nombre: 'Grado en Ingienería de Organización Industrial' },
    { valor: 'ing-energia', nombre: 'Grado en Ingienería de de la Energía' },
    { valor: 'ing-electronica-robotica-mecatronica', nombre: 'Grado en Ingienería Electrónica, Robótica y Mecatrónica' }
  ];

  // para el dropdown

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // se inyectan las dependencias


  register() {
    // se ejecuta cuando se hace ngSubmit
    this.error = '';

    if (!this.uvus || !this.email || !this.grado || !this.password) {
      this.error = 'Por favor, completa todos los campos';
      return;
    }

    this.cargando = true;

    const datos = {
      uvus: this.uvus,
      email: this.email,
      grado: this.grado,
      password: this.password
    };

    // crea un objeto con los datos introducidos listos para enviar al backend

    this.authService.register(datos).subscribe({
      // llama al metodo register del servicio que realiza la peticion http a django, luego se suscribe al observable devuelto
      next: (response) => {
        this.router.navigate(['/']);
        // si la peticion es exitosa envia al home
      },
      error: (err) => {
        this.error = 'Error al registrar.';
        this.cargando = false;
      }
    });

  }



}
