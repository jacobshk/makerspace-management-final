import { Component, OnInit } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Space, UserStateService } from '../user-state.service';
import { arrayRemove } from 'firebase/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {
  currID : string | undefined;
  userSubscription : Subscription;

  constructor(private firebase : AngularFirestore, private service : UserStateService) {
   }
  confirmDelete(){
    var currEmail = getAuth().currentUser.email
    //delete all spaces user created
    this.firebase.collection('spaces',ref=>(ref.where('email','==',currEmail)))
    .snapshotChanges()
    .forEach(i =>{
      i.forEach(j=>{
          this.firebase.doc('spaces/'+j.payload.doc.id).delete()
        })
      })
    //delete user email from all spaces' "joined users"
    this.firebase
    .collection('spaces', ref=>ref.where('joinedUsers','array-contains',currEmail))
    .snapshotChanges().subscribe(item =>{
      item.forEach(x =>{
        console.log(x.payload.doc.data())
        this.firebase.collection('spaces').doc(x.payload.doc.id).update({
          joinedUsers: arrayRemove(currEmail)
        })
        .then(
          success=>{
            //get user doc id, delete user
            this.userSubscription = this.firebase.collection('users',ref=>(ref.where('email','==',currEmail)))
            .snapshotChanges()
            .subscribe(item =>{
              item.forEach(i=>{
                this.currID = i.payload.doc.id
                this.firebase.doc('users/'+this.currID).delete().then(x =>{
                  this.userSubscription.unsubscribe()
                  getAuth().signOut(),
                  window.location.href = ""
                })
              })
            })
          }
        )
        
      })
    })
    
  }
  ngOnInit(): void {}

}
