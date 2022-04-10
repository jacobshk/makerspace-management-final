import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../user-state.service'
import { arrayRemove, arrayUnion } from 'firebase/firestore';
@Component({
  selector: 'app-transfer-owner-component',
  templateUrl: './transfer-owner-component.component.html',
  styleUrls: ['./transfer-owner-component.component.css']
})
export class TransferOwnerComponentComponent implements OnInit {

  ownerControl = new FormControl();
  constructor(@Inject(MAT_DIALOG_DATA) public data: {spaceID : string, spaceName: string}, private snackBar : MatSnackBar, private firestore: AngularFirestore) { }
  confirm(){
    const temp = this.ownerControl.value 
    let c = 0;
    if(!(temp.length == 0)){
      this.firestore.collection('users').snapshotChanges().subscribe(item=>{
        item.forEach(u =>{
          
          const x = u.payload.doc.data() as User
          if(x.email == temp){
            this.firestore.collection('users').doc(u.payload.doc.id).update({
              spacesJoined : arrayUnion(this.data.spaceID),
              spacesCreated : arrayRemove(this.data.spaceID)
            }).then(success=>{

            
            this.firestore.collection('spaces')
            .doc(this.data.spaceID)
            .update({email : temp, hostName: temp})
            .then( success=>{
              this.firestore.collection('spaces').doc(this.data.spaceID).update({
                joinedUsers: arrayUnion(temp)
              })
              this.snackBar.open('Successfully updated space owner!','Dismiss',{duration: 3000})
            }, failure=>{
              this.snackBar.open('Something went wrong!','Dismiss', {duration: 3000})
            })
          })
          }
          
          if(c == item.length-1){
            this.snackBar.open('User not found! They must have a makerspace management account.')
          }
          c++
          
        })
      })
      
    }
    else{
      this.snackBar.open('Enter a new name!', 'Dismiss', {duration: 3000});

    }
  }
  ngOnInit(): void {
  }

}
