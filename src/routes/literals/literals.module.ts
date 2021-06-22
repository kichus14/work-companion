import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {LiteralsRoutingModule} from './literals-routing.module';
import {LiteralsComponent} from './literals.component';


@NgModule({
  declarations: [
    LiteralsComponent
  ],
  imports: [
    CommonModule,
    LiteralsRoutingModule
  ]
})
export class LiteralsModule { }
