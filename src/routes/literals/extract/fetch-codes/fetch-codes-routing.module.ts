import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FetchCodesComponent} from './fetch-codes.component';

const routes: Routes = [{ path: '', component: FetchCodesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FetchCodesRoutingModule { }
