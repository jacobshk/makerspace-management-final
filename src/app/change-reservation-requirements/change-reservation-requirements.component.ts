import { Component, OnInit, Inject} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-change-reservation-requirements',
  templateUrl: './change-reservation-requirements.component.html',
  styleUrls: ['./change-reservation-requirements.component.css']
})
export class ChangeReservationRequirementsComponent implements OnInit {
  timeControl = new FormGroup({
    minControl : new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(2)]),
    maxControl : new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(2)]),
  });
  minVal : string =''
  maxVal : string = ''
  constructor(@Inject(MAT_DIALOG_DATA) public data: {spaceID : string, spaceName: string}, private firestore : AngularFirestore, private snackbar : MatSnackBar) { }
  saveTime(){
    this.minVal = this.timeControl.value.minControl;
    this.maxVal = this.timeControl.value.maxControl;
    if((this.minVal.length > 2) || ( this.maxVal.length > 2)){
      this.snackbar.open('Make sure you enter a max of 2 digits!', 'Dismiss', {duration: 3000})
    }
    else{
      if(parseInt(this.minVal) > parseInt(this.maxVal)){
        this.snackbar.open('Make sure your maximum value is greater than your minimum!', 'Dismiss', {duration: 3000})
      }
      else{
      this.firestore.collection('spaces',ref=>ref.where('spaceID','==',this.data.spaceID))
      .doc(this.data.spaceID)
      .update({minResLength:this.minVal, maxResLength : this.maxVal}).then(
        success=>{
          this.snackbar.open('Successfully updated hours!',',Dismiss', {duration: 3000})
        }
      )
      }
    }
  }
  ngOnInit(): void {
  }

}
