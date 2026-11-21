import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  isSignInTab = true;
    loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder,  private auth: Auth, private router: Router,   private cdr: ChangeDetectorRef) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  switchTab(isSignIn: boolean) {
    this.isSignInTab = isSignIn;
    // You can handle navigation or state change for "Create Account" here
  }

  onSubmit() {
    
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.auth.login({
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    }).subscribe({

      next: (response) => {

        this.loading = false;

        const dashboard = this.auth.getDashboardUrl(
          response.user.role
        );
console.log(dashboard)
        this.router.navigateByUrl(dashboard);
        this.cdr.detectChanges();

      },

      error: (error) => {

        this.loading = false;
        this.errorMessage =
          error.error?.message || 'Invalid email or password';
                  this.cdr.detectChanges();
      },
      complete: () => {
      this.loading = false;
    }

    });
  
  }
}
