import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {path:"login", component: LoginComponent},
  {path:"register", component: RegistrationComponent},
  {path:"todo-list", component: TodoListComponent},
  {path:"**",pathMatch:"full",component: PageNotFoundComponent},
];
