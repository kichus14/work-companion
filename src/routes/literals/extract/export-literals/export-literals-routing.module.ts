import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExportLiteralsComponent} from './export-literals.component';

const routes: Routes = [{ path: '', component: ExportLiteralsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportLiteralsRoutingModule { }
