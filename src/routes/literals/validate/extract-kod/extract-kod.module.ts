import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AccordionModule} from 'primeng/accordion';
import {BlockUIModule} from 'primeng/blockui';
import {CardModule} from 'primeng/card';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ComponentModule} from '../../../../app/components/component.module';

import {ExtractKodRoutingModule} from './extract-kod-routing.module';
import {ExtractKodComponent} from './extract-kod.component';


@NgModule({
  declarations: [
    ExtractKodComponent
  ],
    imports: [
        CommonModule,
        ExtractKodRoutingModule,
        CardModule,
        ComponentModule,
        BlockUIModule,
        AccordionModule,
        ProgressSpinnerModule
    ]
})
export class ExtractKodModule { }
