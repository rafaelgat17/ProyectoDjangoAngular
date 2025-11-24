import { Routes } from '@angular/router';
import { BloqueComponent } from './components/bloque/bloque.component';
import { TeoriaComponent } from './components/teoria/teoria.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Página de inicio
  { path: 'bloque/:id/teoria', component: TeoriaComponent },  // Teoría
  { path: 'bloque/:id/ejercicio', component: BloqueComponent },  // Ejercicio
  { path: '**', redirectTo: '' }
];
