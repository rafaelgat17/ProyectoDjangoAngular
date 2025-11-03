import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true, // para componentes sin modulos.
  imports: [CommonModule, RouterLink, RouterLinkActive],
  // CommonModule: para directivas como ngFor o ngIf
  // RouterLink: para navegar con [routerLink]
  // RouterLinkActive: para marcar el enlace activo
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  bloques = [ // Array de objetos, cada uno con un id y un nombre.
    { id: 1, nombre: 'Bloque 1' },
    { id: 2, nombre: 'Bloque 2' },
    { id: 3, nombre: 'Bloque 3' },
    { id: 4, nombre: 'Bloque 4' },
    { id: 5, nombre: 'Bloque 5' }
  ];
}
