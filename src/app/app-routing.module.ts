import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { WawbComponent } from './maps/m1wawb/wawb.component';
import { TroubledwatersComponent } from './maps/m3troubledwaters/troubledwaters.component';
import { M6Component } from './maps/m6/m6-component';

const routes: Routes = [
  {path: 'water-above-water-below', component: WawbComponent},
  {path: 'troubled-waters-the-nile-conflict', component: TroubledwatersComponent},
  {path: 'm6', component: M6Component},
  {path: '', component: MainPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
