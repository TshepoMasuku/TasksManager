import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NativeDateAdapter } from '@angular/material/core';
// import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [ FormsModule,NgFor,NgClass,NgIf, 
    // MatFormFieldModule,MatInputModule,MatDatepickerModule,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
  // providers: [provideNativeDateAdapter()],
  // providers: [ {provide: NativeDateAdapter(), useClass: NativeDateAdapter} ],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  tasksArray: any = [];
  taskTitle: string = "";
  taskPriority: string = "";
  taskDueDate: string = "";  // date-format: "dd/mm/yyyy";
  showTaskEditForm: boolean = false;
  taskTitleEdited: string = "";
  taskPriorityEdited: string = "";
  taskDueDateEdited: string = "";  // date-format: "dd/mm/yyyy";
  constructor() {}

  showCalendar() {
    this.taskDueDate = Date();
    // console.log('this.taskDueDate :>> ', this.taskDueDate);
    alert("PICK YOUR TASK'S DUE DATE.(OPTIONAL)");
  }

  addTask() {
    const currentTask = {
      id: "task"+this.tasksArray.length,
      taskTitle: this.taskTitle,
      taskPriority: this.taskPriority,
      taskDueDate: this.taskDueDate,
      showTaskEditForm: this.showTaskEditForm,
    };
    this.tasksArray.push(currentTask);
    this.clearAddTaskInputs();
  }
  clearAddTaskInputs() {
    // This clears all the inputs entered by the user, after adding a TASK.
    this.taskTitle = "";
    this.taskPriority = "";
    this.taskDueDate = "";
  }

  deleteTask(task: any) {
    const newTasksArray = this.tasksArray.filter((item: any) => {
      if (item.id !== task.id) return item
    });
    this.tasksArray = newTasksArray;
  }

  editTask(task: any) {
    task.showTaskEditForm = !task.showTaskEditForm;
  }
  cancelEditedTask(task: any) {
    task.showTaskEditForm = !task.showTaskEditForm;
  }
  saveEditedTask(task: any) {
    // This Method SAVES the edited changes from the TaskEditForm for this current task.
    // This hides/closes the Task Edit Form. After all the user changes/edits have been saved accordingly.
    task.showTaskEditForm = !task.showTaskEditForm;

    // This gets the currently saved task from this.tasksArray.
    const currentTaskDetails = this.tasksArray.filter((item: any) => {
      if(item.id === task.id) return item
    });
    // console.log('current Task Details :>> ', currentTaskDetails[0]);

    // Create const newTaskDetails, to save & replace the previously saved task in this.tasksArray.
    const newTaskDetails: object = {
      ...task, 
      taskTitle: (this.taskTitleEdited !== '') ? (this.taskTitleEdited) : (currentTaskDetails[0].taskTitle), 
      taskPriority: (this.taskPriorityEdited !== '') ? (this.taskPriorityEdited) : (currentTaskDetails[0].taskPriority), 
      taskDueDate: (this.taskDueDateEdited !== '') ? (this.taskDueDateEdited) : (currentTaskDetails[0].taskDueDate),
    };
    // console.log('new Task Details :>> ', newTaskDetails);
    const newTasksArray: any = [];
    for(let taskItem of this.tasksArray) {
      if(taskItem.id === task.id) {
        newTasksArray.push(newTaskDetails);
      } else {
        newTasksArray.push(taskItem);
      }
    }
    this.tasksArray = newTasksArray;
    // console.log('this.tasksArray :>> ', this.tasksArray);
    this.clearTaskEditFormInputs();
  }
  clearTaskEditFormInputs() {
    // This clears all the saved inputs entered by the user, after editing a TASK.
    this.taskTitleEdited = "";
    this.taskPriorityEdited = "";
    this.taskDueDateEdited = "";
  }

  taskTitleChanged(event: any) {
    this.taskTitleEdited = event.target.value;
    // console.log('taskTitleChanged() --> event.target.value :>> ', event.target.value, '&& this.taskTitleEdited :>> ', this.taskTitleEdited);
  }
  taskPriorityChanged(event: any) {
    this.taskPriorityEdited = event.target.value;
    // console.log('taskPriorityChanged() --> event.target.value :>> ', event.target.value, '&& this.taskPriorityEdited :>> ', this.taskPriorityEdited);
  }
}
