import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {KodMappingComponent} from './kod-mapping.component';

const routes: Routes = [{ path: '', component: KodMappingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KodMappingRoutingModule { }
