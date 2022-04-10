import { Component, OnInit,Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStateService, machines, Space } from '../user-state.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-mac',
  templateUrl: './delete-mac.component.html',
  styleUrls: ['./delete-mac.component.css']
})
export class DeleteMacComponent implements OnInit {
  m : machines = this.data.machine
  constructor(public dialogRef: MatDialogRef<DeleteMacComponent>, @Inject(MAT_DIALOG_DATA) public data: {spaceID : string, machine : machines},private firestore : AngularFirestore, public snackBar: MatSnackBar) { }

  delete(){
    
    this.firestore.collection('machines',ref=>(ref.where('machineName','==',this.data.machine.machineName))).snapshotChanges()
    .subscribe(item=>{
      item.forEach(i=>{
        this.firestore.collection('machines').doc(i.payload.doc.id).delete().then(success=>{
          this.snackBar.open('Successfully deleted machine.','Dismiss',{duration:3000})
          this.dialogRef.close();
        })
      })
    })
  }
  cancel(){
    this.dialogRef.close();
  }
  ngOnInit(): void {
  }

}
