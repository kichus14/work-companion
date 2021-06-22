import {ChangeDetectorRef, Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LocalStorageService} from 'ngx-store';
import {MessageService} from 'primeng/api';
import {finalize} from 'rxjs/operators';
import {USER_DETAIL_STORAGE_KEY} from '../../app/constants/localstorage.constant';
import {Path} from '../../app/constants/routes.constant';
import {RequestError} from '../../app/services/api.service';

import {UserService} from '../../app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public readonly loginForm: FormGroup;
  loginProgress = false;

  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly localStorageService: LocalStorageService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    const authKey = this.localStorageService.get(USER_DETAIL_STORAGE_KEY);
    if (authKey != null && authKey !== '') {
      this.router.navigate([Path.home]);
    }
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  showControlError(controlName: string, error: string): boolean {
    const control = this.loginForm.get(controlName);
    if (control == null) {
      throw new Error('Form is not initialised');
    }
    return control.hasError(error) && (control.touched || control.dirty);
  }

  doLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.loginProgress = true;
    this.userService.login(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginProgress = false;
          this.cdr.markForCheck();
        })
      )
    .subscribe((response) => {
      this.userService.setUser(response);
      this.router.navigate([Path.home]);
    }, (err: RequestError) => {
      this.userService.removeUser();
      this.messageService.add({
        severity: 'error',
        summary: 'Login Error',
        detail: err.message,
        life: 7000,
      });
    });
  }

}
