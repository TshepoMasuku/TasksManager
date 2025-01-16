import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter, NativeDateAdapter, MatNativeDateModule } from '@angular/material/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [ FormsModule,NgFor,NgClass,NgIf,DatePipe,
    MatNativeDateModule,MatFormFieldModule,MatInputModule,MatDatepickerModule,
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
  isTaskOverDue: boolean = false;
  isTaskComplete: boolean = false;

  // These variables below, track & save new edited changes made to a TASK.
  taskTitleEdited: string = "";
  taskPriorityEdited: string = "";
  taskDueDateEdited: string = "";

  // Set the minimum date to the next day(tomorrow) and the maximum date to December 31st a year in the future.
  private readonly _currentYear = new Date().getFullYear();
  private readonly _currentMonth = new Date().getMonth();
  private readonly _currentDay = new Date().getDate();
  // readonly minmaxDate = new Date(Year, Month, Day);
  readonly minDate = new Date(this._currentYear, this._currentMonth, this._currentDay);
  readonly maxDate = new Date(this._currentYear + 1, 11, 31);

  // This is the base URL of the json-server API.
  baseAPIurl: string = 'http://localhost:3000';

  constructor(
    private localStorageService:LocalStorageService,
    private router:Router,
    private http:HttpClient,
  ) {}
  
  ngOnInit() {
    this.getCurrentUserTodoItems();
  }

  // Tracking Expression method.
  trackByTaskId(index: number, task: any) {
    return task.id;
  };

  addTask() {
    const currentTask = {
      id: "Task" + Date.now(),
      taskTitle: this.taskTitle,
      taskPriority: this.taskPriority,
      taskDueDate: this.taskDueDate,
      showTaskEditForm: this.showTaskEditForm,
      isTaskOverDue: this.isTaskOverDue,
      isTaskComplete: this.isTaskComplete,
    };
    if (this.taskTitle.trim() !== "") {
      this.tasksArray.push(currentTask);
      this.cacheCurrentUserTodoItems();
      this.clearAddTaskInputs();
    }
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
    this.cacheCurrentUserTodoItems();
  }

  editTask(task: any) {
    // This hides/closes the Task Edit Form.
    task.showTaskEditForm = !task.showTaskEditForm;
  }

  markTaskComplete(task: any) {
    // This toggles the isTaskComplete variable to show Task Completion!.
    task.isTaskComplete = !task.isTaskComplete;
    this.cacheCurrentUserTodoItems();
  }

  cancelEditedTask(task: any) {
    // This hides/closes the Task Edit Form.
    task.showTaskEditForm = !task.showTaskEditForm;
    this.clearTaskEditFormInputs();
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
    this.cacheCurrentUserTodoItems();
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
  
  getCurrentUserTodoItems() {
    // get all the users and the currentUser from local storage.
    const allUsersArray = this.localStorageService.get('users', []);
    const currentUserArray = this.localStorageService.get('loggedUser', []);
    const currentUser = currentUserArray[0];

    // get the TodoItems of the currentUser.
    if(allUsersArray.length > 0 && currentUserArray.length > 0) {
      for(let user of allUsersArray) {
        if(user.email === currentUser.email) {
          this.tasksArray = user.todoItems;
          break;
        }
      }
    }
  }

  cacheCurrentUserTodoItems() {
    // get all the users and the currentUser from local storage.
    const allUsersArray = this.localStorageService.get('users', []);
    const currentUserArray = this.localStorageService.get('loggedUser', []);
    const currentUser = currentUserArray[0];

    // add TodoItems to currentUser and cache it on the localStorage.
    if(allUsersArray.length > 0 && currentUserArray.length > 0) {
      for(let user of allUsersArray) {
        if(user.email === currentUser.email) {
          user.todoItems = this.tasksArray;
          this.localStorageService.set('users', allUsersArray);
          this.updateCurrentUserTodoItems(user).subscribe((data: any) => {});
        }
      }
    }
  }

  onLogoutUser() {
    this.localStorageService.remove('loggedUser');
    this.router.navigate(['login']);
  }

  checkTaskOverDue(taskDueDate: string) {
    // This resets the variable this.isTaskOverDue to ensure Method reusability.
    this.isTaskOverDue = false;
    // This converts this.minDate into a date format that's similar to taskDueDate: string.
    const dateToday = this.minDate.toISOString();

    if(taskDueDate === '') return this.isTaskOverDue;
    if(taskDueDate < dateToday) {
      this.isTaskOverDue = true;
      return this.isTaskOverDue;
    };
    return this.isTaskOverDue;
  }

  updateCurrentUserTodoItems(user: any) {
    return this.http.put(`${this.baseAPIurl}/users/${user.id}`, user);
  }
}
