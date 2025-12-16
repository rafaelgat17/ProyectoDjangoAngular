import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

// Interceptor para añadir el token JWT a las peticiones salientes.
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken(); // Usamos tu método getToken()

  // Solo si existe el token en localStorage, clonamos y modificamos la petición.
    if (token) {
        const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(authReq);
    }

  // Si no hay token (ej: el usuario no ha iniciado sesión), se deja pasar la petición original.
    return next(req);
};