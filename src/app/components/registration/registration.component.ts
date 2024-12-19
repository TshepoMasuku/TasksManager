import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registerForm: FormGroup;

  constructor(private router:Router, private fb:FormBuilder) {
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
  
  signup() {
    // Initialize only the needed form controls in our method.
    const passwordValue = this.registerForm.get('password')?.value;
    const confirmPasswordValue = this.registerForm.get('confirmPassword')?.value;
    const confirmPasswordErrors = this.registerForm.get('confirmPassword')?.errors;
    const confirmPasswordControl = this.registerForm.get('confirmPassword');
    
    // Check if the user's input passwords do match. If not, then add not_matching error in confirmPasswordControl.
    const isPasswordsMatch = this.checkPasswordsMatch(passwordValue, confirmPasswordValue);
    if (isPasswordsMatch) {
      this.goToTodoList();
    } else {
      confirmPasswordControl?.setErrors({...confirmPasswordErrors, not_matching: true});
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
}
