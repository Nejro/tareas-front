import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterType, Task } from 'src/app/interfaces/Task';
import { NgxPaginationModule } from 'ngx-pagination';
import { tasksService } from 'src/app/servicios/tasks.service';
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NgxPaginationModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit{
  p: number = 1;

  toDoList = signal<Task[]>([]);

  filter = signal<FilterType>('all');

  toDoListFiltered = computed(() =>{
    const filter = this.filter();
    const toDo = this.toDoList();
    switch(filter){
      case 'active':
        return toDo.filter((toDo) => !toDo.isDone)
      case 'done' :
        return toDo.filter((toDo) => toDo.isDone)
        default:
          return toDo;
    }
  })

  newToDo = new FormControl('',{
    nonNullable:true,
    validators:[Validators.required, Validators.minLength(3)]
  })

  constructor(private taskservice: tasksService ){}

  ngOnInit(): void {
    this.taskservice.getTasks()
    .subscribe({
      next: res => {
        this.toDoList.set(res);
      }
    })
  }

  changeFilter(filterString:FilterType){
    this.filter.set(filterString);
  }

  refreshPage() {
    location.reload();
  }

  addToDo() {
    if (this.newToDo.valid) {
      const newTask: any = {
        description: this.newToDo.value,
        isDone:false
      };
      this.taskservice.createTask(newTask)
      .subscribe({
        next: () => {
          //alert('Tarea creada con éxito');
          this.refreshPage();
        },
        error:
        (error) => {
          console.error('Error al crear la tarea:', error);
        }
      })
        }
      this.newToDo.reset();
    }

    removetoDo(id: number): void {
      this.taskservice.deleteTask(id)
    .subscribe({
      next: () => {
        //alert('Tarea eliminada exitosamente');
        this.refreshPage();
      },
      error: (error) => {
        console.error('Error al eliminar la tarea:', error);
      }
    });
  }

  toggletoDo(toDoID: number): void {
    const toDoToUpdate = this.toDoList().find(toDo => toDo.id === toDoID);
    if (toDoToUpdate) {
      toDoToUpdate.isDone = !toDoToUpdate.isDone;
      this.taskservice.updateTask(toDoToUpdate)
        .subscribe({
          next : () => {
            console.log('Estado de completado actualizado exitosamente en la base de datos.');
          },
          error:  error => {
            console.error('Error al actualizar el estado de completado en la base de datos:', error);
            toDoToUpdate.isDone = !toDoToUpdate.isDone;
          }
    });
    }
  }

  updatetoDo(taskId:Number, event:Event): void {
    this.deactivateEditMode(taskId);
    const descriptionReceived = (event.target as HTMLInputElement).value;
    let taskFind = this.searchTaskById(taskId);
    if (taskFind!=null){
      taskFind.description = descriptionReceived
      this.taskservice.updateTask(taskFind)
      .subscribe({
        next: res => {
          this.toDoList.update((prev_toDos)=>
            prev_toDos.map((toDo)=>{
              return toDo.id === res.id
              ? {...toDo,description: descriptionReceived}
              :toDo;
            }
          ))
        },
        error: (error) => {
          console.error('Error al editar la tarea:', error);
        }
      });
    }else{
      console.error('ID no encontrado.')
    }
  }

  deactivateEditMode(taskId:Number){
    return this.toDoList.update((prev_toDos) =>
    prev_toDos.map((toDo) =>{
      return toDo.id === taskId
      ?{...toDo,editing: false}
      :toDo
    })
    )
  }

  searchTaskById(taskId: Number): Task | undefined {
    const tasks = this.toDoList();
    return tasks.find(function(task){
      return task.id == taskId;
    });
  }

  activateEditMode(editId:Number){
    return this.toDoList.update((prev_toDos) =>
    prev_toDos.map((toDo) =>{
      return toDo.id === editId
      ?{...toDo,editing: true}
      :{...toDo,editing: false}
    })
    )
  }

}
