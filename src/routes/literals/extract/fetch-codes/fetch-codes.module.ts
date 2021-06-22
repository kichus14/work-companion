import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AccordionModule} from 'primeng/accordion';
import {BlockUIModule} from 'primeng/blockui';
import {CardModule} from 'primeng/card';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ComponentModule} from '../../../../app/components/component.module';
import {FetchCodesRoutingModule} from './fetch-codes-routing.module';
import {FetchCodesComponent} from './fetch-codes.component';

@NgModule({
  declarations: [
    FetchCodesComponent
  ],
  imports: [
    CommonModule,
    FetchCodesRoutingModule,
    CardModule,
    ComponentModule,
    BlockUIModule,
    AccordionModule,
    ProgressSpinnerModule
  ]
})
export class FetchCodesModule { }
