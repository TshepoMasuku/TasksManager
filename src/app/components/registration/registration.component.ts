import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';

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
  currentUser = {
    'name': '',
    'email': '',
    'password': '',
  };
  users: any[] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private router:Router,
    private fb:FormBuilder
  ) {
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
    this.users = this.localStorageService.get('users', this.users);
    // const usersArr = [
    //   {name: "Tshepo Masuku", email: "tshepomasuku000@gmail.com", password: "pp00!!lllD000"},
    //   {name: "Tshepo", email: "tshepomasuku111@gmail.com", password: "pp00!!lllD111"},
    //   {name: "Masuku", email: "tshepomasuku222@gmail.com", password: "pp00!!lllD222"},
    //   {name: "Name Surname", email: "namesurname333@gmail.com", password: "pp00!!lllD333"},
    //   {name: "Name", email: "namesurname444@gmail.com", password: "pp00!!lllD444"},
    //   {name: "Surname", email: "namesurname555@gmail.com", password: "pp00!!lllD555"},
    //   {name: "Yx", email: "Yx888@gmail.com", password: "Ppp0o0!!!888"},
    //   {name: "Ea", email: "Ea999@gmail.com", password: "Ppp0o0!!!999"},
    // ]
    // this.users = usersArr;
    // this.localStorageService.set('users', this.users);
  }

  signup() {
    // Initialize only the needed form controls in our method.
    const passwordValue = this.registerForm.get('password')?.value;
    const confirmPasswordValue = this.registerForm.get('confirmPassword')?.value;
    const confirmPasswordErrors = this.registerForm.get('confirmPassword')?.errors;
    const confirmPasswordControl = this.registerForm.get('confirmPassword');
    
    // Check if the user's input passwords do match.
    // If not, then add not_matching error in confirmPasswordControl.
    const isPasswordsMatch = this.checkPasswordsMatch(passwordValue, confirmPasswordValue);
    if (!isPasswordsMatch) {
      confirmPasswordControl?.setErrors({...confirmPasswordErrors, not_matching: true});
    }

    // Also Check if the user isn't already registered.
    this.isUserRegistered = false;  // Reset isUserRegistered variable status first.
    if (!this.isUserRegistered) {
      this.cacheUserRegistration();
      this.goToTodoList();
    }
  }
  
  checkPasswordsMatch(password: string, confirmPassword: string) {
    // method to compare user's input passwords.
    return( password === confirmPassword && confirmPassword !== '' );
  }
  
  goToSignup() {
    this.router.navigate(["/login"]);
  }
  goToTodoList() {
    this.router.navigate(["/todo-list"]);
  }

  private cacheUserRegistration() {
    // Form Values, inputed by the User.
    const nameValue = this.registerForm.get('name')?.value;
    const emailValue = this.registerForm.get('email')?.value;
    const passwordValue = this.registerForm.get('password')?.value;
    const currentUser = {
      // 'id': Date.now(),
      'name': nameValue,
      'email': emailValue,
      'password': passwordValue,
    };

    // Caching/Saving User Credentials into the local storage.
    this.currentUser = currentUser;
    const isUserRegistered = this.checkUserRegistered(this.currentUser);
    if(!isUserRegistered) {
      this.users.push(this.currentUser);
      this.localStorageService.set('users', this.users);
    }
  }

  checkUserRegistered(currentUser: any): boolean {
    // Checks if a User is Registered.
    for(let user of this.users) {
      if (user.email === currentUser.email) {
        this.isUserRegistered = true;
      } 
    }
    return this.isUserRegistered;
  }
}
