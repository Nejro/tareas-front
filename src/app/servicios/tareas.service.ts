import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tareas } from '../interfaces/tareas';
@Injectable({
  providedIn: 'root'
})
export class tareasService {

  servidor = 'http://localhost:4000';
  constructor(private servicio:HttpClient) { }

  getTareas(): Observable<any> {
    return this.servicio.get(`${this.servidor}/api/tasks/getAll`);
  }

  createTareas(tareas:tareas) {
    return this.servicio.post<tareas>(`${this.servidor}/api/tasks/add`, tareas);
  }

  editarTareas(tarea: tareas): Observable<any> {
    return this.servicio.put(`${this.servidor}/api/tasks/updateById/${tarea.id}`, tarea);
  }

  deleteTareas(id: number): Observable<any> {
    return this.servicio.delete(`${this.servidor}/api/tasks/deleteById/${id}`);
  }
}
