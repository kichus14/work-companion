import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AccordionModule} from 'primeng/accordion';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {ComponentModule} from '../../../../app/components/component.module';

import {KodMappingRoutingModule} from './kod-mapping-routing.module';
import {KodMappingComponent} from './kod-mapping.component';


@NgModule({
  declarations: [
    KodMappingComponent
  ],
  imports: [
    CommonModule,
    KodMappingRoutingModule,
    CardModule,
    ButtonModule,
    ComponentModule,
    AccordionModule,
    TableModule,
    RippleModule,
    InputTextModule,
    FormsModule,
  ]
})
export class KodMappingModule { }
