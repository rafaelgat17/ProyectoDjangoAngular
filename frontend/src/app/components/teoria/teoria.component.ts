// src/app/teoria/teoria.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MathJaxDirective } from '../../../math-jax.directive'
import { TeoriaService } from '../../../services/teoria.service';

@Component({
  selector: 'app-teoria',
  standalone: true,
  imports: [CommonModule, MathJaxDirective], // <-- AÑADIR LA DIRECTIVA AQUÍ
  templateUrl: './teoria.component.html',
  styleUrl: './teoria.component.css'
})
export class TeoriaComponent implements OnInit {
  bloqueId: number = 0;
  teoria: any = null; // Para almacenar los datos de la teoría

  constructor(
    private route: ActivatedRoute,
    private teoriaService: TeoriaService // <-- INYECTAR SERVICIO
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.bloqueId = +params['id']; // Convertir a número
      this.cargarTeoria();
    });
  }

  cargarTeoria() {
    if (this.bloqueId > 0) {
      this.teoriaService.getTeoria(this.bloqueId).subscribe(data => {
        this.teoria = data;
      });
    }
  }
}