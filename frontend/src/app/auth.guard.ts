// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, GuardResult, MaybeAsync } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service'; // Asegúrate de tener la ruta correcta

// UrlTree permite definir una nueva ruta de navegación (redirección)

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    // es una snapshot de la ruta a la que el usuario esta intentando navegar
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Si el usuario no está logueado, lo rediriges al login,
    // pero guardas la URL de destino original en los parámetros del login:
    // return this.router.createUrlTree(['/login'], { queryParams: { redirectUrl: state.url } });

    // este metodo se ejecuta antes de que se active cualquier ruta que lo utilice

      if (this.authService.isLoggedIn()) {
        return true;
      } else {
        return this.router.createUrlTree(['/login']);
      }
    }

}