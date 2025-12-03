import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators as V,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '@interfaces/services/auth/auth.interface';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '@components/shared/alert-dialog/alert-dialog';
import { Alert } from '@interfaces/components/alert/alert.interface';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, AlertDialogComponent],
  templateUrl: './login.view.html',
  styleUrl: './login.view.css',
})
export class LoginView implements OnInit {

  public sessionExpiredMessage: string | null = null;

  private readonly _loginForm: FormGroup;
  get loginForm() {
    return this._loginForm;
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
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this._loginForm = this._buildLoginForm();
  }

  ngOnInit() {
    console.log('Session expired', sessionStorage.getItem('session_expired'));
    if (sessionStorage.getItem('session_expired')) {
      this.sessionExpiredMessage = 'La sesión ha expirado. Por favor, inicie sesión nuevamente.';
      sessionStorage.removeItem('session_expired');
      this.cdr.detectChanges();
    }
  }

  private _buildLoginForm() {
    return this.formBuilder.group({
      email: new FormControl('', [V.required, V.email]),
      password: new FormControl('', [V.required, V.minLength(1), V.maxLength(20)]),
    });
  }

  private _showAlert(title: string, message: string, type: Alert['type'] = 'success') {
    this._controls.showAlert = true;
    this._controls.alert = { title, message, type, buttonText: 'Aceptar' };
  }

  public async login() {
    console.log(this.loginForm.value);
    if (!this.loginForm.valid) {
      return;
    }

    try {
      const payload = this._createPayload();
      const response = await firstValueFrom(this.authService.login(payload));
      console.log('Login response', response);
      this.router.navigate(['/home']);
    } catch (error: any) {
      if (error.status === 401) {
        this._showAlert('Error', 'Credenciales incorrectas', 'error');
        this.cdr.detectChanges();
        return;
      }
      this._showAlert('Error al iniciar sesión', error.message, 'error');
      this.cdr.detectChanges();
    }
  }

  private _createPayload() {
    const { email, password } = this.loginForm.value;
    const payload: LoginRequest = { email, password };
    return payload;
  }
}
