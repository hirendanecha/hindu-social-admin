import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { ToastService } from 'src/app/services/toast.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoggedIn = false;
  loginMessage = '';
  errorMessage = '';
  isLoginFailed = false;
  position = 'top-end';
  visible = false;
  percentage = 0;
  type = '';

  placement = ToasterPlacement.TopEnd;
  constructor(
    private tokenStorage: TokenStorageService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toaster: ToastService,
  ) { }

  toggleToast() {
    this.visible = !this.visible;
  }

  onVisibleChange(event: boolean) {
    console.log(event);
    this.visible = event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange($event: number) {
    this.percentage = $event * 25;
  }
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.router.navigate([`/home`]);
    }

    this.loginForm = this.fb.group({
      Email: [null, [Validators.required]],
      Password: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    this.userService.login(this.loginForm.value).subscribe({
      next: (data: any) => {
        if (data) {
          this.tokenStorage.saveToken(data?.accessToken);
          // this.tokenStorage.saveUser(data.user);
          this.toaster.success('Login successfully');
          this.router.navigate([`/dashboard`]);
        } else {
          this.loginMessage = data.mesaage;
          this.toaster.danger('Invalid Email and Password. Kindly try again !!!!');
        }
      },
      error: (err) => {
        this.toaster.danger(err.error.message);
      },
    });
  }
}
