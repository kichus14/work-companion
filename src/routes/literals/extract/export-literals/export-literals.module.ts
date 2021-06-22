import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {RippleModule} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {ExportLiteralsRoutingModule} from './export-literals-routing.module';
import {ExportLiteralsComponent} from './export-literals.component';

@NgModule({
  declarations: [
    ExportLiteralsComponent
  ],
  imports: [
    CommonModule,
    ExportLiteralsRoutingModule,
    ButtonModule,
    RippleModule,
    SharedModule,
    CardModule,
    TableModule,
    TooltipModule
  ]
})
export class ExportLiteralsModule { }
