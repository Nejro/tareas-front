import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../interfaces/Task';
@Injectable({
  providedIn: 'root'
})
export class tasksService {

  servidor = 'http://localhost:4000';
  constructor(private servicio:HttpClient) { }

  getTasks(): Observable<any> {
    return this.servicio.get(`${this.servidor}/api/tasks/getAll`);
  }

  createTask(task:Task) {
    return this.servicio.post<Task>(`${this.servidor}/api/tasks/add`, task);
  }

  updateTask(task: Task): Observable<any> {
    return this.servicio.put(`${this.servidor}/api/tasks/updateById/${task.id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.servicio.delete(`${this.servidor}/api/tasks/deleteById/${id}`);
  }
}
