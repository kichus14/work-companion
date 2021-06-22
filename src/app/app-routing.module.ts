import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Path} from './constants/routes.constant';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: Path.home,
  },
  {
    path: Path.login,
    loadChildren: () =>
      import('../routes/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: Path.home,
    loadChildren: () =>
      import('../routes/home/home.module').then(m => m.HomeModule)
  },
  {
    path: Path.literals,
    loadChildren: () =>
      import('../routes/literals/literals.module').then(m => m.LiteralsModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
