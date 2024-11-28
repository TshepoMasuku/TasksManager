import { Component } from '@angular/core';
import { TaskComponent } from './../task/task.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TaskComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent {

  constructor() {}

  showCalendar() {
    alert("PICK THE TASKS DUE DATE.(OPTIONAL)");
  }

}
