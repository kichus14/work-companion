import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Path} from '../../../app/constants/routes.constant';
import {ValidateComponent} from './validate.component';

const routes: Routes = [{
  path: '',
  component: ValidateComponent,
  children: [
    {
      path: '',
      redirectTo: Path.validateLiterals_ExtractKOD,
      pathMatch: 'full',
    },
    {
      path: Path.validateLiterals_ExtractKOD,
      loadChildren: () =>
        import('./extract-kod/extract-kod.module').then(m => m.ExtractKodModule)
    }, {
      path: Path.validateLiterals_listKOD,
      loadChildren: () =>
        import('./list-kod/list-kod.module').then(m => m.ListKodModule)
    }, {
      path: Path.validateLiterals_KODMapping,
      loadChildren: () =>
        import('./kod-mapping/kod-mapping.module').then(m => m.KodMappingModule)
    }, {
      path: 'results',
      loadChildren: () =>
        import('./results/results.module').then(m => m.ResultsModule)
    },
  ]
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidateRoutingModule { }
