import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {RippleModule} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';

import {ValidateCodesRoutingModule} from './validate-codes-routing.module';
import {ValidateCodesComponent} from './validate-codes.component';


@NgModule({
  declarations: [
    ValidateCodesComponent
  ],
  imports: [
    CommonModule,
    ValidateCodesRoutingModule,
    ButtonModule,
    RippleModule,
    SharedModule,
    CardModule,
    TableModule,
    TooltipModule
  ]
})
export class ValidateCodesModule { }
