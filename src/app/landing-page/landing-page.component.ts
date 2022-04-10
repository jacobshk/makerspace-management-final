import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from '@firebase/app-compat';
import { first } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User, UserStateService } from '../user-state.service';
import { Observable, Subscription } from 'rxjs';
import { inMemoryPersistence } from 'firebase/auth';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  constructor( public auth: AngularFireAuth, public snackBar: MatSnackBar, private firestore : AngularFirestore, private service : UserStateService) {}
  isLoggedIn() {
    return this.auth.authState.pipe(first()).toPromise();
 } 
 userSubscription : Subscription

  async login(){
    await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(
        (success) =>{
          this.userSubscription = this.firestore
          .collection('users',ref=>ref.where('email','==',success.user.email))
          .snapshotChanges()
          .subscribe(item=>{
            if(item.length ==0){
              this.snackBar.open('Account not found!','Dismiss',{duration: 3000})
              this.userSubscription.unsubscribe()

            }
            else if(item.length > 0){
              this.snackBar.open('Sucessfully signed in!','Dismiss',{duration: 3000}),
              window.location.href = "signedin"
              this.userSubscription.unsubscribe()
            }
          })
      },
      (failure)=>{
        this.snackBar.open('Something went wrong!','Dismiss',{duration: 3000})
      })   
}
async signup(){
  this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
  .then((result) =>{
    let user = result.user
    let e = user?.email
    this.userSubscription = this.firestore.collection('users',ref=>ref.where('email','==',e)).get()
    .subscribe(item =>{
      if(item.size ==0){
        this.firestore.collection('users').add
        ({
          'user' : user?.displayName,
          'email' : user?.email,
          'spacesJoined' : [],
          'spacesCreated' : []
        }).then(
          (success)=>{
            this.snackBar.open('Successfully created account!','Dismiss',{duration: 3000})
          },
          (failure)=>{
            this.snackBar.open('Something went wrong!','Dismiss',{duration: 3000})
          }
        )
      }
      else {
        this.snackBar.open('Account already exists!','Dismiss',{duration: 3000})
      }
    })  
  }).catch(function(error){
    console.log(error);
  });


}


  ngOnInit(): void {}
}
