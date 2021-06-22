import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Path} from '../../../app/constants/routes.constant';
import {ExtractComponent} from './extract.component';

const routes: Routes = [{
  path: '',
  component: ExtractComponent,
  children: [
    {
      path: '',
      redirectTo: Path.extractLiterals_FetchCodes,
      pathMatch: 'full',
    },
    {
      path: Path.extractLiterals_FetchCodes,
      loadChildren: () =>
        import('./fetch-codes/fetch-codes.module').then(m => m.FetchCodesModule)
    },
    {
      path: Path.extractLiterals_ValidateCodes,
      loadChildren: () =>
        import('./validate-codes/validate-codes.module').then(m => m.ValidateCodesModule)
    },
    {
      path: Path.extractLiterals_UploadLiterals,
      loadChildren: () =>
        import('./upload-literals/upload-literals.module').then(m => m.UploadLiteralsModule)
    },
    {
      path: Path.extractLiterals_exportLiterals,
      loadChildren: () =>
        import('./export-literals/export-literals.module').then(m => m.ExportLiteralsModule)
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtractRoutingModule { }
