import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isUserRegistered: boolean = true;
  currentUser: object = {
    'email': '',
    'password': '',
  };
  users: any[] = [];

  // This is the base URL of the json-server API.
  baseAPIurl: string = 'http://localhost:3000';

  constructor(
    private localStorageService: LocalStorageService,
    private router:Router,
    private fb:FormBuilder,
    private http:HttpClient,
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(99),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ]]
    });
  }
  
  ngOnInit() {
    this.readAllUsers().subscribe((data: any) => {
      this.users = data;
      this.localStorageService.set('users', this.users);
    });
    this.users = this.localStorageService.get('users', this.users);
  }

  signin() {
    // Form Values, inputed by the User.
    // const emailValue = this.loginForm.get('email')?.value;
    // const passwordValue = this.loginForm.get('password')?.value;
    const emailValue = this.loginForm.controls['email'].value;
    const passwordValue = this.loginForm.controls['password'].value;
    const currentUser = {
      'email': emailValue,
      'password': passwordValue,
    };

    // Check if the user isn't already registered.
    this.currentUser = currentUser;
    const isUserRegistered = this.checkUserRegistered(this.currentUser);
    if (isUserRegistered) {
      this.localStorageService.set('loggedUser', [this.currentUser]);
      this.goToTodoList();
    }
  }
  
  goToRegistration() {
    this.router.navigate(["/register"]);
  }
  goToTodoList() {
    this.router.navigate(["/todo-list"]);
  }

  checkUserRegistered(currentUser: any): boolean {
    // Checks if a User is Registered.
    this.isUserRegistered = false;  // Reset isUserRegistered variable status first.
    for(let user of this.users) {
      if (user.email === currentUser.email && user.password === currentUser.password) {
        this.isUserRegistered = true;
      } 
    }
    return this.isUserRegistered;
  }

  readAllUsers() {
    return this.http.get(`${this.baseAPIurl}/users`);
  }
}
