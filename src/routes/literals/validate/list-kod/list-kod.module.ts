import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {RippleModule} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';

import {ListKodRoutingModule} from './list-kod-routing.module';
import {ListKodComponent} from './list-kod.component';


@NgModule({
  declarations: [
    ListKodComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ListKodRoutingModule,
    CardModule,
    TableModule,
    ButtonModule,
    RippleModule,
    TooltipModule
  ]
})
export class ListKodModule { }
