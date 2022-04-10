import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from "firebase/auth";
import { arrayUnion } from "firebase/firestore";
import { UserStateService, User } from '../user-state.service';

@Component({
  selector: 'app-join-space',
  templateUrl: './join-space.component.html',
  styleUrls: ['./join-space.component.css']
})
export class JoinSpaceComponent implements OnInit {
  joinControl = new FormControl('',[Validators.required, Validators.minLength(6)]);
  email = getAuth().currentUser?.email;
  checkSubscription : Subscription;
  spaceSubscription : Subscription;
  userJoinedSpaces : String[]
  userOwnedSpaces : String[]
  constructor(private firestore: AngularFirestore, private snackBar: MatSnackBar) { }

  joinSpace(){
    var joinID = this.joinControl.value;
    var userDocID = '';
    //check if input is valid
    if(/[^a-zA-Z0-9]/.test( joinID )){
      this.snackBar.open('Please ensure your input is alphanumeric (no special characters)!', 'Dismiss', {duration: 3000});
    }
    else if(!(joinID.length == 6)){
      this.snackBar.open('Please ensure your code is the correct length (6 digits)!', 'Dismiss', {duration: 3000});
    }
    else{
    //check if user already joined space
    if(this.userJoinedSpaces.includes(joinID)){
      this.snackBar.open('You can\'t join a space you\'re already a member of!', 'Dismiss', {duration: 3000});
    }
    //check if user owns space
    else if(this.userOwnedSpaces.includes(joinID)){
      this.snackBar.open('You can\'t join a space you own!', 'Dismiss', {duration: 3000});
    }
    else{
      //add joined space to user's joined space array
      this.spaceSubscription = this.firestore
      .collection('users',ref=>ref.where('email','==',this.email))
      .snapshotChanges()
      .subscribe(item=>{
        item.forEach(i =>{
          userDocID = i.payload.doc.id
          try{
            this.firestore.collection('users').doc(userDocID)
            .update({
              spacesJoined: arrayUnion(joinID)
            });
            this.firestore.collection('spaces').doc(joinID)
            .update({
              joinedUsers: arrayUnion(this.email)
            }).then((success=>{
              this.joinControl.reset()
              this.spaceSubscription.unsubscribe();
              this.snackBar.open('successfully joined '+joinID, 'Dismiss', {duration: 3000});  
            }))

          }
          catch(err){
            this.snackBar.open('Something went wrong! Error code: '+err, 'Dismiss', {duration: 3000});
          }
          finally{
            
          }
        })
      })
      //add joined user to space's joined users array
      
    } 
}
  }
  ngOnDestroy(): void {
    if(this.spaceSubscription){
      this.spaceSubscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    //check user's already joined/owned spaces
    this.checkSubscription = this.firestore.collection('users',ref=>ref.where('email','==',this.email))
    .snapshotChanges()
    .subscribe(item=>{
      item.forEach(i =>{
        const temp = i.payload.doc.data() as User
        this.userJoinedSpaces = temp.spacesJoined;
        this.userOwnedSpaces = temp.spacesCreated;
      })
    })
    
  }

}
