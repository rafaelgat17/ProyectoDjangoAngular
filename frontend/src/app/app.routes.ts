import { Routes } from '@angular/router';
import { BloqueComponent } from './components/bloque/bloque.component';

export const routes: Routes = [
    { path: '', redirectTo: '/bloque/1', pathMatch: 'full' }, // Si se entra directamente al localhost de Angular te redirige al bloque 1, siempre y cuando este vacio.
    { path: 'bloque/:id', component: BloqueComponent } // Cuando se especifique el id en la URL, se redirigira a BloqueComponent.
];
