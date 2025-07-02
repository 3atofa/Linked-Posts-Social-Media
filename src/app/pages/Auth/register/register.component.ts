import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../core/services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly _UsersService = inject(UsersService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _Router = inject(Router);

  register: FormGroup = this._FormBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)]],
    rePassword: ['', [Validators.required]],
    dateOfBirth: ['', [Validators.required]],
    gender: [null, [Validators.required]],
  }, { validators: this.confirmPassword });

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    return password === rePassword ? null : { mismatch: true };
  }

  submitForm(): void {
    if (this.register.valid) {
      const formData = {
        name: this.register.value.name,
        email: this.register.value.email,
        password: this.register.value.password,
        rePassword: this.register.value.rePassword,
        dateOfBirth: this.register.value.dateOfBirth,
        gender: this.register.value.gender
      };

      this._UsersService.signUp(formData).subscribe({
        next: (res) => {
          this._ToastrService.success('Registration successful!', 'Success');
          console.log(res);
          this._Router.navigate(['/login']);
        },
        error: (err) => {
          this._ToastrService.error(err.error.message || 'Registration failed', 'Error');
          console.log(err);
        }
      });
    } else {
      this._ToastrService.warning('Please fill all required fields correctly', 'Form Invalid');
      this.register.markAllAsTouched();
    }
  }
}