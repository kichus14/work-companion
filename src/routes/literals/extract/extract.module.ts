import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {CardModule} from 'primeng/card';
import {StepsModule} from 'primeng/steps';
import {ExtractLiteralsService} from './extract-literals.service';

import {ExtractRoutingModule} from './extract-routing.module';
import {ExtractComponent} from './extract.component';

@NgModule({
  declarations: [
    ExtractComponent
  ],
  imports: [
    CommonModule,
    ExtractRoutingModule,
    StepsModule,
    CardModule
  ],
  providers: [ExtractLiteralsService],
})
export class ExtractModule {
}
