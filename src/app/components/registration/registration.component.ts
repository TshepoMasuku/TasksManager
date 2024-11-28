import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  constructor(private router:Router) {}

  goToSignup() {
    this.router.navigate(["/login"])
  }
  goToTodoList() {
    this.router.navigate(["/todo-list"])
  }
}
