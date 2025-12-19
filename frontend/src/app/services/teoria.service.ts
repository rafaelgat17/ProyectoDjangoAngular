// src/app/services/teoria.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface IBloqueTeoria {
  titulo: string;
  secciones: Array<{
    titulo: string;
    contenido: string;
    imagen_url: string;
    imagen_caption: string;
  }>;
}

export interface IContenidoTeoria {
  [key: number]: IBloqueTeoria;
}

const CONTENIDO_TEORIA: IContenidoTeoria = {
  1: {
    titulo: 'Conceptos fundamentales y leyes de Kirchhoff',
    secciones: [
      {
        titulo: 'Carga eléctrica',
        contenido: `
          La Carga eléctrica, $q(t)$, es la propiedad de las partículas elementales que
          constituyen la materia y que se manifiesta por medio de fuerzas eléctricas.

          <ul>
            <li>El electrón, e$^{-}$, constituye la carga eléctrica más pequeña posible, representada como $q_e$.</li>
            <li>Se toma la carga del electrón como negativa, y positiva la del protón.</li>
            <li>Aplicando energía se puede conseguir que los electrones se desplacen.</li>
          </ul>

          <div style="margin-top: 15px;">
            Unidad en el SI: culombio [C] que equivale a $6.242\\cdot 10^{18}$ $q_e$.
          </div>
        `,
        imagen_url: 'assets/images/coulomb.png',
        imagen_caption: 'Charles-Augustin de Coulomb (1736-1806)'
      }
    ]
  },
};

@Injectable({
  providedIn: 'root'
})
export class TeoriaService {
  // Ahora el método devuelve un IBloqueTeoria, y no un 'any'
  getTeoria(bloqueId: number): Observable<IBloqueTeoria> {
    // TypeScript ahora sabe que CONTENIDO_TEORIA puede ser indexado con 'bloqueId'
    // y que el resultado será un IBloqueTeoria.
    return of(CONTENIDO_TEORIA[bloqueId]); 
  }
}