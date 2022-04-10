import { Component, OnInit, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MachineCalendarComponent } from '../machine-calendar/machine-calendar.component';
import { machines, Reservation } from '../user-state.service';
@Component({
  selector: 'app-edit-mac',
  templateUrl: './edit-mac.component.html',
  styleUrls: ['./edit-mac.component.css']
})
export class EditMacComponent implements OnInit {
  titleControl = new FormControl('',[Validators.required, Validators.minLength(1)])
  descControl = new FormControl('',[Validators.required, Validators.minLength(1)]);
  constructor(@Inject(MAT_DIALOG_DATA) public data: {spaceID : string, machine : machines}, private snackbar : MatSnackBar, private firestore : AngularFirestore) { }
  saveMachine(){
    this.firestore.collection('machines',ref=>(ref.where('machineName',"==",this.data.machine.machineName)))
    .snapshotChanges()
    .subscribe(i=>{
      i.forEach(item=>{
        const t = item.payload.doc.data() as machines
        const id = item.payload.doc.id
        this.firestore.collection('machines').doc(id)
        .set({
          dates : t.dates,
          material : t.material,
          spaceID : t.spaceID,
          machineName : this.titleControl.value, 
          description:this.descControl.value
        }).then(
        success=>{
          this.snackbar.open('Successfully updated machine!','Dismiss',{duration:3000})
        }
      )
    })
  })
    
  }
  ngOnInit(): void {
  }

}
