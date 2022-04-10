import { Component, OnInit,Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayRemove } from 'firebase/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-space',
  templateUrl: './delete-space.component.html',
  styleUrls: ['./delete-space.component.css']
})
export class DeleteSpaceComponent implements OnInit, OnDestroy {
  tempFirstSub : Subscription;
  tempSecondSub : Subscription;
  joinControl = new FormControl();
  constructor(@Inject(MAT_DIALOG_DATA) public data: {spaceID : string, spaceName: string}, private snackBar : MatSnackBar, private firestore: AngularFirestore) { }
  confirm(){     
    this.tempSecondSub = this.firestore.collection('users', ref=>ref.where('joinedSpaces','array-contains',this.data.spaceID))
      .snapshotChanges()
      .subscribe( item=>{
        item.forEach( i=>{
          let t = i.payload.doc.id
          this.firestore.collection('users').doc(t).update({joinedSpaces : arrayRemove(this.data.spaceID)})
        })
      })
      this.tempFirstSub = this.firestore.collection('machines', ref=>ref.where('spaceID','==',this.data.spaceID))
      .snapshotChanges()
      .subscribe( item=>{
        item.forEach( i=>{
          let t = i.payload.doc.id
          this.firestore.collection('machines').doc(t).delete();          
        })
      })
      this.firestore.collection('spaces')
      .doc(this.data.spaceID)
      .delete().then( success=>{
        window.location.href = "/signedin"

      }
      )
    
  }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
      this.tempFirstSub.unsubscribe()
      this.tempSecondSub.unsubscribe()
  }

}

