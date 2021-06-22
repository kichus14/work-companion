import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Path} from '../../app/constants/routes.constant';
import {LiteralsComponent} from './literals.component';

const routes: Routes = [{
  path: '',
  component: LiteralsComponent,
  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: Path.extractLiterals,
    },
    {
      path: Path.extractLiterals,
      loadChildren: () =>
        import('./extract/extract.module').then(m => m.ExtractModule)
    },
    {
      path: Path.validateLiterals,
      loadChildren: () =>
        import('./validate/validate.module').then(m => m.ValidateModule)
    },
  ],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiteralsRoutingModule { }
