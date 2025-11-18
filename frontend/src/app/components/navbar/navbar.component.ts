import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  bloques = [
    { id: 1, nombre: 'Bloque 1' },
    { id: 2, nombre: 'Bloque 2' },
    { id: 3, nombre: 'Bloque 3' },
    { id: 4, nombre: 'Bloque 4' },
    { id: 5, nombre: 'Bloque 5' }
  ];

  // Variable para controlar qué desplegable está abierto
  bloqueAbierto: number | null = null;

  // Abrir desplegable
  abrirDesplegable(bloqueId: number) {
    this.bloqueAbierto = bloqueId;
  }

  // Cerrar desplegable
  cerrarDesplegable() {
    this.bloqueAbierto = null;
  }

  // Verificar si un desplegable está abierto
  estaAbierto(bloqueId: number): boolean {
    return this.bloqueAbierto === bloqueId;
  }
}