import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registerForm: FormGroup;
  isUserRegistered: boolean = false;
  currentUser: any = {
    'name': '',
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
    this.registerForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
    });
    this.registerForm = this.fb.group({
      name: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(33),
        Validators.pattern('[A-Z][A-Za-z ]*')
      ]],
      email: ['',[Validators.required,Validators.email]],
      password: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(99),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ]],
      confirmPassword: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(99),
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

  signup() {
    // Declare Form Controls or Values, in the method.
    // const nameValue = this.registerForm.get('name')?.value;
    // const emailValue = this.registerForm.get('email')?.value;
    // const passwordValue = this.registerForm.get('password')?.value;
    // const confirmPasswordControl = this.registerForm.get('confirmPassword');
    const nameValue = this.registerForm.controls['name'].value;
    const emailValue = this.registerForm.controls['email'].value;
    const passwordValue = this.registerForm.controls['password'].value;
    const confirmPasswordControl = this.registerForm.controls['confirmPassword'];

    // Check if the user's input passwords do match.
    // If not, then add not_matching error in confirmPasswordControl.
    const isPasswordsMatch = this.checkPasswordsMatch(passwordValue, confirmPasswordControl.value);
    if(!isPasswordsMatch) {
      confirmPasswordControl.setErrors({...confirmPasswordControl.errors, not_matching: true});
    } else {
      const currentUser = {
        'id': Date.now(),
        'name': nameValue,
        'email': emailValue,
        'password': passwordValue,
        'todoItems': [],
      };
      this.currentUser = currentUser;
      // Also Check if the user isn't already registered.
      this.checkUserRegistered();
    }

    if(!this.isUserRegistered) {
      this.cacheUserRegistration();
      this.goToTodoList();
    }
  }
  
  checkPasswordsMatch(password: string, confirmPassword: string) {
    // method to compare user's input passwords.
    return( confirmPassword !== '' && confirmPassword === password );
  }
  
  goToSignup() {
    this.router.navigate(["/login"]);
  }
  goToTodoList() {
    this.router.navigate(["/todo-list"]);
  }

  cacheUserRegistration() {
    // Caching/Saving User Credentials into the local storage.
    this.users.push(this.currentUser);
    this.localStorageService.set('users', this.users);
    this.localStorageService.set('loggedUser', [this.currentUser]);
    this.createCurrentUser().subscribe((data: any) => {});
  }

  checkUserRegistered(): boolean {
    // Method checks if a User is Registered.
    this.isUserRegistered = false;  // This resets the variable.
    for(let user of this.users) {
      if(user.email === this.currentUser.email) {
        this.isUserRegistered = true;
        return this.isUserRegistered;
      } 
    }
    return this.isUserRegistered;
  }

  readAllUsers() {
    return this.http.get(`${this.baseAPIurl}/users`);
  }
  createCurrentUser() {
    return this.http.post(`${this.baseAPIurl}/users`, this.currentUser);
  }
}
