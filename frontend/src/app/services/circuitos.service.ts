import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CircuitosService {
  private apiUrl = 'http://localhost:8000/api/circuito';

  constructor(private http: HttpClient) { }

  testConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/test/`);
  }

  generarCircuito(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/generar-circuito/`, datos);
  }
}
