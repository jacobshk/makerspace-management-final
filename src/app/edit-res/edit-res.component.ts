import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { machines, Reservation } from '../user-state.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-res',
  templateUrl: './edit-res.component.html',
  styleUrls: ['./edit-res.component.css']
})
export class EditResComponent implements OnInit {
  constructor(private snackbar : MatSnackBar, public firestore : AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data:{spaceID : string, resStart : string,
       resEnd : string, machine: machines[],currDateReservations: Reservation[],
       hasOpHours: boolean, hasResRestrictions : boolean,spaceOpen : number, 
       spaceClose:number,maxResLength : number, minResLength: number,
       currDay : Date, currEmail : string})
   { }
  machine = this.data.machine
  tempRes : Subscription;
  reservationFormGroup = new FormGroup({
    startTimeControl : new FormControl(''),
    endTimeControl : new FormControl(),
    selectedMachineControl : new FormControl(),
    AMPMControlS : new FormControl(''),
    AMPMControlE : new FormControl(''),
  });
  saveChanges(){
    this.createRes()
  }
  editReservation(m : string, date: Date, startTime : string, endTime : string){
    var oldStart = this.data.resStart
    var oldStartMS =Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()+1,parseInt(oldStart.split(' ')[0]))
    var newStart = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()+1,parseInt(startTime))    
    var newEnd = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()+1,parseInt(endTime))

    this.tempRes = this.firestore
    .collection('machines',ref=>ref.where('machineName','==',m).where('spaceID','==',this.data.spaceID))
    .snapshotChanges().subscribe(item=>{
      item.forEach(mac=>{
        const machine = mac.payload.doc.data() as machines
        let oldDates = machine.dates;
        let newRes = newStart+' '+this.data.currEmail+' '+newEnd
        let newDates = [newRes]
        oldDates.forEach(d=>{
          let resStart = d.split(' ')[0]
          if(!(parseInt(resStart) == oldStartMS)){ //create new array without the res being replaced
            newDates.push(d)
          }
        })
        this.firestore.collection('machines').doc(mac.payload.doc.id).set(
          {
            dates : newDates,
            material : machine.material,
            spaceID : machine.spaceID,
            machineName : machine.machineName, 
            description:machine.description
          }
          
        ).then(success=>{
          this.snackbar.open('Successfully updated reservation!','Dismiss',{duration:3000})
        })
        this.tempRes.unsubscribe();

      })
    })
  }
  createRes(){//before adding reservation to database, this function checks to ensure reservation is valid
    var resOverlap = false
    var currMachine = (this.reservationFormGroup.value.selectedMachineControl)
    if(currMachine == null){
      this.snackbar.open('Please select a machine!', 'Dismiss', {duration:4000});
    }
    else{
      //check that end time is after begin time 
      var selectedStart = (this.reservationFormGroup.value.startTimeControl)
      var selectedEnd = (this.reservationFormGroup.value.endTimeControl)
      var startAP = (this.reservationFormGroup.value.AMPMControlS)
      var endAP = (this.reservationFormGroup.value.AMPMControlE)
      selectedStart *=1 
      selectedEnd*=1
      //account for 12 hour time, AM/PM, convert to 24 hour time for easier comparisons
      if(startAP == 2){
        selectedStart+=12
      }
      if(endAP==2){
        selectedEnd = selectedEnd + 12
      }
      if(!(selectedStart < selectedEnd)){
        this.snackbar.open('Please ensure your start time is before your end time!', 'Dismiss', {duration:4000})
      }
      else{

        if(this.data.currDateReservations.length > 0){
        //get all reservations on current day, check if their times overlap with the selected 
        this.data.currDateReservations.forEach(d =>{
          let t = d.start //12 hour string 
          let y = t.split(' ')[0] //number
          let resStart = parseInt(y.split(':')[0]) //split HH:MM:YY to just HH
          let resStartAP = (t.split(' ')[1]) //AM/PM
          let u = d.end //12 hour string 
          let p = u.split(' ')[0] //number
          let resEnd = parseInt(p.split(':')[0])
          let resEndAP = (u.split(' ')[1]) //AM/PM
          if(!(resStart == parseInt(this.data.resStart))){//ignore itself          
            if(resEndAP =='PM'){
              resEnd += 12
            }
            if(resStartAP =='PM'){
              resStart+=12
            }
            if(d.machine == currMachine){
              if((selectedStart == resStart)&&(selectedEnd<=resEnd)){
                resOverlap = true
              }
              else if((selectedStart==resStart)&&(selectedEnd > resEnd)){
                resOverlap = true
              }
              else if(selectedStart>=resEnd){
                resOverlap = false
              }
              else if(selectedEnd <=resStart){
                resOverlap = false
              }
              else if((selectedStart > resStart)&&(selectedStart < resEnd)){ //if res attempt starts/ends within preexisting
                resOverlap = true
              }
              else if ((selectedStart < resStart)&&(selectedEnd<=resEnd)){
                resOverlap = true
              }
              else if((selectedStart > resEnd)){ //if res attempt starts after res ends
                resOverlap = false
              }
              else if((selectedStart<resStart)&&(selectedEnd>resEnd))  {//if res attempt starts/ends before preexisting
                resOverlap = true
              }
              else if((selectedStart < resStart)&&(selectedEnd<resEnd)){ //if res attempt starts before, ends within
                resOverlap = true
              }
              else if((selectedStart < resStart)&&(selectedEnd > resEnd)){//if res attempt starts before, ends after
                resOverlap = true
              }
              
              else if((selectedEnd > resStart)&&(selectedEnd < resEnd))  {//if res attempt starts/ends before preexisting
                resOverlap = false
              }

              else if((selectedStart < resStart) && (selectedEnd<resEnd)){
                resOverlap = false
              }
            }
            }
          }
          )}
          else if (this.data.currDateReservations.length == 0){
            resOverlap = false
          }
        
        if(resOverlap){
          this.snackbar.open('Please ensure your reservation does not overlap with other reservations.','Dismiss',{duration :4000})
        }
        else{
          if(this.data.hasOpHours && !this.data.hasResRestrictions){
            if(selectedStart < this.data.spaceOpen){
              this.snackbar.open('Please ensure your start time is after the space opens!', 'Dismiss', {duration:4000})
            }
            else{
              if(selectedEnd > this.data.spaceClose){
                this.snackbar.open('Please ensure your end time is before the space closes!', 'Dismiss', {duration:4000})
              }
              else{
                this.snackbar.open('Working...', 'Dismiss', {duration:4000})
                this.editReservation(currMachine,this.data.currDay,selectedStart,selectedEnd)    
              }
            }   
          }
          
          else if(this.data.hasResRestrictions && !this.data.hasOpHours){
            if((selectedEnd-selectedStart) > this.data.maxResLength){
              this.snackbar.open('Please ensure your reservation is not longer than the allotted duration!', 'Dismiss', {duration:4000})
            }
            else{
              if((selectedEnd-selectedStart)<this.data.minResLength){
                this.snackbar.open('Please ensure your reservation is not shorter than the minimum duration!', 'Dismiss', {duration:4000})
              }
              else{
                this.snackbar.open('Working...', 'Dismiss', {duration:4000})
                this.editReservation(currMachine,this.data.currDay,selectedStart,selectedEnd)    
              }
            } 
          }

          else if(!this.data.hasOpHours && !this.data.hasResRestrictions){
            this.snackbar.open('Working...', 'Dismiss', {duration:4000})
            this.editReservation(currMachine,this.data.currDay,selectedStart,selectedEnd)

          }

          else if(this.data.hasOpHours && this.data.hasResRestrictions){
            if((selectedEnd-selectedStart) > this.data.maxResLength){
              this.snackbar.open('Please ensure your reservation is not longer than the allotted duration!', 'Dismiss', {duration:4000})
            }
            else{
              if((selectedEnd-selectedStart)<this.data.minResLength){
                this.snackbar.open('Please ensure your reservation is not shorter than the minimum duration!', 'Dismiss', {duration:4000})
              }
              else{
                if(selectedStart < this.data.spaceOpen){
                  this.snackbar.open('Please ensure your start time is after the space opens!', 'Dismiss', {duration:4000})
                }
                else{
                  if(selectedEnd > this.data.spaceClose){
                    this.snackbar.open('Please ensure your end time is before the space closes!', 'Dismiss', {duration:4000})
                  }
                  else{
                    this.snackbar.open('Working...', 'Dismiss', {duration:4000})
                    this.editReservation(currMachine,this.data.currDay,selectedStart,selectedEnd)  
                  }
                }
              }
              }
          }
        }
        }
      }
    }
    ngOnInit(): void {
    }

  }
