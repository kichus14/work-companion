import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListKodComponent} from './list-kod.component';

const routes: Routes = [{ path: '', component: ListKodComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListKodRoutingModule { }
