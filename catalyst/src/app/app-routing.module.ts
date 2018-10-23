import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "./guards/auth.guard";
import { NotAuthGuard } from "./guards/not-auth.guard";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule', canActivate: [NotAuthGuard] },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule', canActivate: [NotAuthGuard] },
  { path: 'athletes', loadChildren: './add-athlete/add-athlete.module#AddAthletePageModule', canActivate: [AuthGuard] },
  { path: 'game', loadChildren: './create-game/game.module#GamePageModule', canActivate: [AuthGuard] },
  { path: 'athletes/:name/:id', loadChildren: './single-athlete/single-athlete.module#SingleAthletePageModule', canActivate: [AuthGuard] },
  { path: 'games', loadChildren: './games/games.module#GamesPageModule', canActivate: [AuthGuard] },
  { path: 'games/:id', loadChildren: './single-game/single-game.module#SingleGamePageModule', canActivate: [AuthGuard] },
  { path: 'game/:id/:stat', loadChildren: './game-stat/game-stat.module#GameStatPageModule', canActivate: [AuthGuard] },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  providers: [
     AuthGuard,
     NotAuthGuard
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
