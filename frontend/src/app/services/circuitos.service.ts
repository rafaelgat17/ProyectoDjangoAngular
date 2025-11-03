import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// Le dice a Angular que esta clase puede ser usada en otros lugares.
// Crea una sola instancia del servicio para toda la aplicacion.

export class CircuitosService {
  private apiUrl = 'http://localhost:8000/api/circuitos';

  // Guarda la URL de Django.

  constructor(private http: HttpClient) { }

  // Angular le da a este servicio acceso a HttClient para hacer peticiones HTTP.

  testConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/test/`);
  }



  generarCircuito(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/generar-circuito/`, datos);
  }
}

// Hace una peticion POST a /generar_circuito/ y se le envia datos, y lo recibe Django en request.data

// Un servicio es una clase con una funcion cuyo objetivo es compartir logica entre varios componentes.