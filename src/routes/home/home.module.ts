import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {CardModule} from 'primeng/card';

import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';


@NgModule({
  declarations: [
    HomeComponent
  ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        CardModule
    ]
})
export class HomeModule { }
