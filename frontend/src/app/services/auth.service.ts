import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api/auth';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(uvus: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, { uvus, password })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('uvus', response.uvus);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  register(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, datos)
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('uvus', datos.uvus);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('uvus');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUvus(): string | null {
    return localStorage.getItem('uvus');
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }
  
}
