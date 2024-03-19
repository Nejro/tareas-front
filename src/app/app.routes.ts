import { Routes } from '@angular/router';
import { TareasComponent } from './componentes/tareas/tareas.component';


export const routes: Routes = [
  {path: 'tareas', component: TareasComponent},
  {path:'**', pathMatch: 'full', redirectTo: 'tareas'}
];
