import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-space-hours',
  templateUrl: './change-space-hours.component.html',
  styleUrls: ['./change-space-hours.component.css']
})
export class ChangeSpaceHoursComponent implements OnInit {
  timeFormGroup = new FormGroup({
    startTimeControl : new FormControl('', [Validators.required, Validators.minLength(1)]),
    endTimeControl : new FormControl('', [Validators.required, Validators.minLength(1)]),
    AMPMControlS :new FormControl('', [Validators.required, Validators.minLength(1)]),
    AMPMControlE : new FormControl('', [Validators.required, Validators.minLength(1)]),
    weekControl : new FormControl([], [Validators.required, Validators.minLength(1)]),
  });
  currID : string = ''
  startHour : number = 0
  endHour : number = 0
  startAP : number = 0
  endAP : number =0
  weekOpen : Array<number> =[]
  constructor(private snackBar : MatSnackBar,private firestore : AngularFirestore,private router : Router) { 
    this.currID = this.router.url.substring(1,this.router.url.length)

  }
  saveHours(){
    this.weekOpen = this.timeFormGroup.value.weekControl 
    this.startHour = this.timeFormGroup.value.startTimeControl
    this.endHour = this.timeFormGroup.value.endTimeControl
    this.startAP = this.timeFormGroup.value.AMPMControlS
    this.endAP = this.timeFormGroup.value.AMPMControlE
      //AM = 1, PM = 2. 
      
      if(!(this.weekOpen.length == 0)){
        if(!((this.startHour == 0) && (this.endHour==0))){
          if(!((this.startAP == null) && (this.endAP==0))){
            if(this.startAP < this.endAP){ //if am, pm
            //start hour has to be less than end hour, so no need for further checks
            this.firestore.collection('spaces',ref=>(ref.where('spaceID','==',this.currID)))
            .doc(this.currID)
            .update({hasOperatingDays : true, operatingDays: this.weekOpen, startTime: this.startHour,startAP:this.startAP,endTime:this.endHour,endAP:this.endAP}).then(
              success=>{
                this.snackBar.open("Successfully updated operating hours!",'Dismiss',{duration: 3000})
              }
            )
          } 
          else if (this.startAP == this.endAP){//if am->am or pm->pm
            if(this.startHour < this.endHour){
              //no need for futher checks
              this.firestore.collection('spaces',ref=>(ref.where('spaceID','==',this.currID)))
              .doc(this.currID)
              .update({hasOperatingDays : true, operatingDays: this.weekOpen, startTime: this.startHour,startAP:this.startAP,endTime:this.endHour,endAP:this.endAP})
              .then(success=>{
                this.snackBar.open("Successfully updated operating hours!",'Dismiss',{duration: 3000})
              })
            }
            else{ //start hour not less than end hour, not valid
              this.snackBar.open("Your start hour must be less than your end hour!",'Dismiss',{duration: 3000})
            }
          }
          else if(this.startAP > this.endAP){//if pm -> am, not valid 
            this.snackBar.open("Your start hour must be less than your end hour!",'Dismiss',{duration: 3000})
          }
        }
      }
      }
    }
  ngOnInit(): void {
  }

}
