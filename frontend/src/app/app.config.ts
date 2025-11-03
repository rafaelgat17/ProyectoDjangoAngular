import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), // Le dice a Angular que use el sistema de rutas que se definio en app.routes.ts
    provideHttpClient() // Activa el modulo HTTP para poder hacer peticiones a Django.
  ]
};