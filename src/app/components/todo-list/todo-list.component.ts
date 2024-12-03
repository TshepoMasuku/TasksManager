import { Component, ChangeDetectionStrategy, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatDatepickerModule, MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter, NativeDateAdapter, MatNativeDateModule } from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [ FormsModule,NgFor,NgClass,NgIf,
    MatFormFieldModule,MatInputModule,MatDatepickerModule,MatNativeDateModule,
    MatDatepickerToggle,MatDatepicker,MatDatepickerInput,MatCardModule,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
  providers: [provideNativeDateAdapter(),NativeDateAdapter,MatDatepickerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  tasksArray: any = [];
  taskTitle: string = "";
  taskPriority: string = "";
  taskDueDate: string = "";
  showTaskEditForm: boolean = false;
  // These variables below, track & save new edited changes made to a TASK.
  taskTitleEdited: string = "";
  taskPriorityEdited: string = "";
  taskDueDateEdited: string = "";
  selected = model<Date | null>(null);
  constructor() {}

  addTask() {
    const currentTask = {
      id: "task"+this.tasksArray.length,
      taskTitle: this.taskTitle,
      taskPriority: this.taskPriority,
      taskDueDate: this.taskDueDate,
      showTaskEditForm: this.showTaskEditForm,
    };
    console.log('currentTask :>> ', currentTask);
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
    // This hides/closes the Task Edit Form.
    task.showTaskEditForm = !task.showTaskEditForm;
  }

  cancelEditedTask(task: any) {
    // This hides/closes the Task Edit Form.
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

    // Create const newTaskDetails, to save & replace the previously saved task in this.tasksArray.
    const newTaskDetails: object = {
      ...task, 
      taskTitle: (this.taskTitleEdited !== '') ? (this.taskTitleEdited) : (currentTaskDetails[0].taskTitle), 
      taskPriority: (this.taskPriorityEdited !== '') ? (this.taskPriorityEdited) : (currentTaskDetails[0].taskPriority), 
      taskDueDate: (this.taskDueDateEdited !== '') ? (this.taskDueDateEdited) : (currentTaskDetails[0].taskDueDate),
    };
    const newTasksArray: any = [];
    for(let taskItem of this.tasksArray) {
      if(taskItem.id === task.id) {
        newTasksArray.push(newTaskDetails);
      } else {
        newTasksArray.push(taskItem);
      }
    }
    this.tasksArray = newTasksArray;
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
  }

  taskPriorityChanged(event: any) {
    this.taskPriorityEdited = event.target.value;
  }

  taskDueDateChanged(event: any) {
    this.taskDueDateEdited = event.target.value;
  }
}
