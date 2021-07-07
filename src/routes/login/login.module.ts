import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BlockUIModule} from 'primeng/blockui';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RippleModule} from 'primeng/ripple';
import { MessageModule } from 'primeng/message';

import {LoginRoutingModule} from './login-routing.module';
import {LoginComponent} from './login.component';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RippleModule,
    CardModule,
    BlockUIModule,
    ProgressSpinnerModule,
    MessageModule,
  ]
})
export class LoginModule { }
