import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAuth  } from "firebase/auth";
import { Subscription } from 'rxjs/internal/Subscription';
import { arrayUnion  } from "firebase/firestore";

@Component({
  selector: 'app-create-space',
  templateUrl: './create-space.component.html',
  styleUrls: ['./create-space.component.css']
})
export class CreateSpaceComponent implements OnInit {
  userSubscription : Subscription;
  
  constructor(private firestore : AngularFirestore, private snackbar : MatSnackBar) {
    this.spaceFormGroup.patchValue({
      hostControl : getAuth().currentUser?.email //set uneditable email value in form
    });
   }
  spaceFormGroup = new FormGroup({
    nameControl : new FormControl('', [Validators.required, Validators.minLength(1)]), //space name 
    idControl : new FormControl('', [Validators.required, Validators.minLength(1)]), //space ID 
    hostControl : new FormControl('', [Validators.required, Validators.minLength(1)]), //host email 
  });
  
  makeid() { //generate random 6 digit Space ID
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *charactersLength));
      }
    return result;
  }
  generateID() {
        this.spaceFormGroup.patchValue({
          idControl : this.makeid()
        });
  }
  onSubmit() {
    const auth = getAuth();
    const email = auth.currentUser?.email
    var uid = '';
    var sid = '';

    if(this.spaceFormGroup.valid){
      sid = this.spaceFormGroup.value.idControl
      this.firestore.collection('spaces').doc(sid).set({
        hostName: this.spaceFormGroup.value.hostControl,
        email: email,
        spaceID: sid,
        spaceName: this.spaceFormGroup.value.nameControl,
        joinedUsers: [],
      })//create new space doc, docID is spaceID


      //add to user's "joined spaces" array
      var currUser = getAuth().currentUser.email
      this.userSubscription = this.firestore.collection('users', ref=>ref.where('email','==',currUser))
      .snapshotChanges().subscribe(item =>{
        item.forEach(res=>{
          uid = res.payload.doc.id
          this.firestore.collection('users').doc(uid)
          .update({
            spacesCreated: arrayUnion(sid)
          }).then(
            (success) =>{
              this.spaceFormGroup.controls.nameControl.reset()
              this.spaceFormGroup.controls.idControl.reset()
              this.snackbar.open('Success! You can safely exit this page or create another space', 'Dismiss', {duration:4000});
              this.userSubscription.unsubscribe()
            },
            (failure) =>{
              this.snackbar.open('Something went wrong!', 'Dismiss', {duration:4000});
              this.userSubscription.unsubscribe()
            })
        })
      })
      }
      else{
        this.snackbar.open('Uh oh, something\'s wrong with your input!', 'Dismiss', {duration: 3000});
      }
  }
    
  ngOnInit(): void {  }

}
