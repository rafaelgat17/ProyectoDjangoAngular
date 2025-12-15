import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  uvus: string = '';
  password: string = '';
  cargando: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.error = '';

    if (!this.uvus || !this.password) {
      this.error = 'Por favor, completa todos los campos'
      return;
    }

    this.cargando = true;

    this.authService.login(this.uvus, this.password).subscribe({
      next: (response) => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = 'UVUS o contraseña incorrectos';
        this.cargando = false;
      }
    });
  }
}
