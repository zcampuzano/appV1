import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "./guards/auth.guard";
import { NotAuthGuard } from "./guards/not-auth.guard";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule', canActivate: [NotAuthGuard] },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule', canActivate: [NotAuthGuard]},
  { path: 'add-athlete', loadChildren: './add-athlete/add-athlete.module#AddAthletePageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [
     AuthGuard,
     NotAuthGuard
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
