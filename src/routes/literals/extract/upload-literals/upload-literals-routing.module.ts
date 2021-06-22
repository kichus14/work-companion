import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UploadLiteralsComponent} from './upload-literals.component';

const routes: Routes = [{ path: '', component: UploadLiteralsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadLiteralsRoutingModule { }
