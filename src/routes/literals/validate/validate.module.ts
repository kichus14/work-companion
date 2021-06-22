import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {StepsModule} from 'primeng/steps';
import {ValidateLiteralsService} from './validate-literals.service';

import {ValidateRoutingModule} from './validate-routing.module';
import {ValidateComponent} from './validate.component';


@NgModule({
  declarations: [
    ValidateComponent
  ],
  imports: [
    CommonModule,
    ValidateRoutingModule,
    StepsModule
  ],
  providers: [ValidateLiteralsService]
})
export class ValidateModule { }
