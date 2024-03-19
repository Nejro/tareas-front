import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterType, tareas } from 'src/app/interfaces/tareas';
import { NgxPaginationModule } from 'ngx-pagination';
import { tareasService } from 'src/app/servicios/tareas.service';
@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NgxPaginationModule],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css'
})
export class TareasComponent implements OnInit{
  p: number = 1;

  todoList = signal<tareas[]>([


  ]);
  filter = signal<FilterType>('all');

  todoListFiltered = computed(() =>{
    const filter = this.filter();
    const todo = this.todoList();

    switch(filter){
      case 'active':
        return todo.filter((todo) => !todo.completed)
      case 'completed' :
        return todo.filter((todo) => todo.completed)
        default:
          return todo;
    }

  })

  newTodo = new FormControl('',{
  nonNullable:true,
  validators:[Validators.required, Validators.minLength(3)]
  })

  constructor(private tareaService: tareasService ){}

  ngOnInit(): void {
    this.tareaService.getTareas()
    .subscribe({
      next: respuesta => {
        this.todoList.set(respuesta);
      }
    })
}

  changeFilter(filterString:FilterType){
    this.filter.set(filterString);
  }

  refreshPage() {
    location.reload();
  }

  addTodo() {
    if (this.newTodo.valid) {
      const nuevaTarea: any = {
        title: this.newTodo.value,
        completed:false
      };
      this.tareaService.createTareas(nuevaTarea)
      .subscribe({
        next: () => {
          alert('Tarea creada con éxito');
          this.refreshPage();
        },
        error:
        (error) => {
          console.error('Error al crear la tarea:', error);
        }
      })
        }
      this.newTodo.reset();
    }

    removeTodo(id: number): void {
      this.tareaService.deleteTareas(id)
    .subscribe({
      next: () => {
        alert('Tarea eliminada exitosamente');
        this.refreshPage();
      },
      error: (error) => {
        console.error('Error al eliminar la tarea:', error);
      }
    });
}


  /*toggleTodo(todoID:number){
    return this.todoList.update((prev_todos)=>
      prev_todos.map((todo)=>{
      return todo.id === todoID
      ?{...todo,completed:!todo.completed}
      :todo;
      })
      );
  } */
  toggleTodo(todoID: number): void {
    const todoToUpdate = this.todoList().find(todo => todo.id === todoID);
    if (todoToUpdate) {
      todoToUpdate.completed = !todoToUpdate.completed;
      this.tareaService.editarTareas(todoToUpdate)
        .subscribe({
          next : () => {
            console.log('Estado de completado actualizado exitosamente en la base de datos.');
          },
          error:  error => {
            console.error('Error al actualizar el estado de completado en la base de datos:', error);
            todoToUpdate.completed = !todoToUpdate.completed;
          }
    });
    }
  }


  updateTodo(taskId:Number, event:Event): void {
    this.deactivateEditMode(taskId);
    const titleReceived = (event.target as HTMLInputElement).value;
    let taskFind = this.searchTaskById(taskId);
    if (taskFind!=null){
      taskFind.title = titleReceived
      this.tareaService.editarTareas(taskFind)
      .subscribe({
        next: res => {
          this.todoList.update((prev_todos)=>
            prev_todos.map((toDo)=>{
              return toDo.id === res.id
              ? {...toDo,title: titleReceived}
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
    return this.todoList.update((prev_todos) =>
    prev_todos.map((toDo) =>{
      return toDo.id === taskId
      ?{...toDo,editing: false}
      :toDo
    })
    )
  }

  searchTaskById(taskId: Number): tareas | undefined {
    const tasks = this.todoList();
    return tasks.find(function(task){
      return task.id == taskId;
    });
  }
  activateEditMode(editId:Number){
    return this.todoList.update((prev_todos) =>
    prev_todos.map((todo) =>{
      return todo.id === editId
      ?{...todo,editing: true}
      :{...todo,editing: false}
    })
    )
  }


}
