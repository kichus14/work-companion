import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {ComponentModule} from 'src/app/components/component.module';

import {UploadLiteralsRoutingModule} from './upload-literals-routing.module';
import {UploadLiteralsComponent} from './upload-literals.component';


@NgModule({
  declarations: [
    UploadLiteralsComponent
  ],
    imports: [
        CommonModule,
        UploadLiteralsRoutingModule,
        CardModule,
        ComponentModule,
        ButtonModule,
    ]
})
export class UploadLiteralsModule { }
