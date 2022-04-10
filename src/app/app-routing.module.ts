import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SignedinComponent } from './signedin/signedin.component';
import { AngularFireAuthGuard, loggedIn } from '@angular/fire/compat/auth-guard';
import { SpacePageComponent } from './space-page/space-page.component';
import { AddMachineComponent } from './add-machine/add-machine.component';
const routes: Routes = [
  { 
    path : 'signedin',
    canActivate: [AngularFireAuthGuard],
    component:  SignedinComponent,
  },
  { 
    path : ':spaceID', 
    canActivate: [AngularFireAuthGuard],
    component : SpacePageComponent
  },
  { 
    path : ':spaceID/addmachine', 
    canActivate: [AngularFireAuthGuard],
    component : AddMachineComponent
  },
  
  { 
    path : '**', 
    component : LandingPageComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
