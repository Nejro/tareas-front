import { Routes } from '@angular/router';
import { TasksComponent } from './componentes/tasks/tasks.component';


export const routes: Routes = [
  {path: 'tasks', component: TasksComponent},
  {path:'**', pathMatch: 'full', redirectTo: 'tasks'}
];
