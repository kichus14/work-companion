import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExtractKodComponent} from './extract-kod.component';

const routes: Routes = [{ path: '', component: ExtractKodComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtractKodRoutingModule { }
