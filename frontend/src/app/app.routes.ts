import { Routes } from '@angular/router';
import { BloqueComponent } from './components/bloque/bloque.component';

export const routes: Routes = [
    { path: '', redirectTo: '/bloque1', pathMatch: 'full' },
    { path: 'bloque/:id', component: BloqueComponent }
];
