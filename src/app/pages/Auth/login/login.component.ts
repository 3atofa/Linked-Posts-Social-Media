import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../../core/services/users/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly _UsersService = inject(UsersService)
  private _toastrService = inject(ToastrService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this._UsersService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          this._toastrService.success(res.message || 'Login successful', 'Success');
          console.log(res);
          if (res.message == 'success') {
            setTimeout(() => {
              // 1- save token
              localStorage.setItem('socialToken', res.token);
              
              // 2- save user data
              this._UsersService.saveUserData();
              // 2- Navigate to home
              this.router.navigate(['/home']);
            }, 1000);
          }
        },
        error: (err) => {
          console.log(err);
          this._toastrService.error(err.error.message || 'Login failed', 'Error');
        }
      })

    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}