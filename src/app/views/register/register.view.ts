import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators as V,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from '@components/shared/alert-dialog/alert-dialog';
import { Alert } from '@interfaces/components/alert/alert.interface';
import { AuthService } from '@services/auth/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RegisterRequest } from '@interfaces/services/auth/auth.interface';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, AlertDialogComponent],
  templateUrl: './register.view.html',
  styleUrl: './register.view.css',
})
export class RegisterView implements OnInit {
  private readonly _registerForm: FormGroup;
  get registerForm() {
    return this._registerForm;
  }

  private _controls = {
    showAlert: false,
    alert: {
      title: '',
      message: '',
      type: 'success' as Alert['type'],
      buttonText: 'Aceptar',
    },
  };
  get controls() {
    return this._controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {
    this._registerForm = this._buildRegisterForm();
  }

  ngOnInit() {}

  private _buildRegisterForm() {
    return this.formBuilder.group({
      name: new FormControl('', [V.required]),
      email: new FormControl('', [V.required, V.email]),
      password: new FormControl('', [V.required, V.minLength(8), V.maxLength(20)]),
      confirmPassword: new FormControl('', [V.required, V.minLength(8), V.maxLength(20)]),
    });
  }

  private _showAlert(title: string, message: string, type: Alert['type'] = 'success') {
    this._controls.showAlert = true;
    this._controls.alert = { title, message, type, buttonText: 'Aceptar' };
  }

  public async register() {
    if (!this.registerForm.valid) return;

    try {
      const payload = this._createPayload();
      const response = await firstValueFrom(this.authService.register(payload));
      console.log('Response', response);
      sessionStorage.setItem('user_registered', 'true');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al registrar el usuario', error);
      this._showAlert('Error', 'Error al registrar el usuario', 'error');
      this.cdr.detectChanges();
    }
  }

  private _createPayload() {
    const { name, email, password } = this.registerForm.value;
    const payload: RegisterRequest = { name, email, password };
    return payload;
  }
}
