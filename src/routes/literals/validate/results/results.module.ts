import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AccordionModule} from 'primeng/accordion';
import {BlockUIModule} from 'primeng/blockui';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RippleModule} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {ComponentModule} from '../../../../app/components/component.module';

import {ResultsRoutingModule} from './results-routing.module';
import {ResultsComponent} from './results.component';


@NgModule({
  declarations: [
    ResultsComponent
  ],
  imports: [
    CommonModule,
    ResultsRoutingModule,
    CardModule,
    AccordionModule,
    ComponentModule,
    ProgressSpinnerModule,
    BlockUIModule,
    TableModule,
    ButtonModule,
    RippleModule,
    TooltipModule
  ]
})
export class ResultsModule { }
