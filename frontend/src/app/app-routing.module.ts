import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {BoxFeed} from "./box-feed.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'boxes',
    pathMatch: 'full'
  },
  {
    path: 'boxes',
    component: BoxFeed
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
