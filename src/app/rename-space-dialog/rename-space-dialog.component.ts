import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-rename-space-dialog',
  templateUrl: './rename-space-dialog.component.html',
  styleUrls: ['./rename-space-dialog.component.css']
})
export class RenameSpaceDialogComponent implements OnInit {

  joinControl = new FormControl();
  constructor(@Inject(MAT_DIALOG_DATA) public data: {spaceID : string, spaceName: string}, private snackBar : MatSnackBar, private firestore: AngularFirestore) { }
  confirm(){
    const temp = this.joinControl.value 
    if(!(temp.length == 0)){
      this.firestore.collection('spaces')
      .doc(this.data.spaceID)
      .update({spaceName : temp})
      .then( success=>{
        this.snackBar.open('Successfully updated space name!','Dismiss',{duration: 3000})
      }, failure=>{
        this.snackBar.open('Something went wrong!','Dismiss', {duration: 3000})
      })
    }
    else{
      this.snackBar.open('Enter a new name!', 'Dismiss', {duration: 3000});

    }
  }
  ngOnInit(): void {
  }

}
