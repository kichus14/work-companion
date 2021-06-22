import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ValidateCodesComponent} from './validate-codes.component';

const routes: Routes = [{ path: '', component: ValidateCodesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidateCodesRoutingModule { }
