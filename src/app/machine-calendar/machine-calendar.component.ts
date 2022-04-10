import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { machines, Space, Reservation} from '../user-state.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { arrayUnion } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { MatDialog } from '@angular/material/dialog';
import { EditResComponent } from '../edit-res/edit-res.component';
import { take } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-machine-calendar',
  templateUrl: './machine-calendar.component.html',
  styleUrls: ['./machine-calendar.component.css']
})
export class MachineCalendarComponent implements OnInit, OnDestroy {
weekday=new Array(7);
  operatingDays : Array<String> = []
  spaceOpen : number = 0
  spaceClose : number = 0
  openHour : number = 0
  closeHour : number = 0
  sAP : string = ''
  eAP : string = ''
  minResLength : number = 0
  maxResLength : number = 0
  hasOpHours : Boolean = false 
  hasResRestrictions : Boolean = false 
  currID : string;
  opDays : string = ''
  machine : Array<string> =[] //machine name array
  machineSubscription : Subscription;
  tempSub : Subscription;
  spaceSubscription : Subscription;
  currEmail : string = getAuth().currentUser.email;
  currDateReservations : Array<Reservation> = []
  minDate : Date;
  currSelectedDate : String = ''
  maxDate : Date; 
  hasMachines : Boolean = false
  hasReservations : Boolean = false
  events: Date[] = [];
  reservationList : Reservation[] = [];
  selectedDate : Boolean = false
  tempSubscription : Subscription;
  canEditRes : Boolean = false;
  resSubscription : Subscription;
  tSubscription : Subscription;
  reservationFormGroup = new FormGroup({
    startTimeControl : new FormControl('',[Validators.required]),
    endTimeControl : new FormControl(),
    selectedMachineControl : new FormControl(),
    AMPMControlS : new FormControl('',[Validators.required]),
    AMPMControlE : new FormControl('',[Validators.required]),
  });
  constructor(private dialog: MatDialog, private fb: FormBuilder, private snackbar : MatSnackBar, private router : Router, private firestore : AngularFirestore) {
    this.currID = this.router.url.substring(1,this.router.url.length)
    const currentYear = new Date().getFullYear();
    const currMonth = new Date().getMonth();
    const today = new Date().getUTCDate();
    this.minDate = new Date(currentYear,currMonth,today+1);
    this.maxDate = new Date(currentYear,currMonth,today+30);
    this.weekday[0]="Mon";
    this.weekday[1]="Tue";
    this.weekday[2]="Wed";
    this.weekday[3]="Thu";
    this.weekday[4]="Fri";
    this.weekday[5]="Sat";
    this.weekday[6]="Sun";

    //determine if current user is host
    this.firestore.collection('spaces').doc(this.currID).snapshotChanges().subscribe(item=>{
      const x = item.payload.data() as Space
      if(x.email == this.currEmail){
        this.canEditRes = true
      }
    })
    
   }

   dateFilter = (d: Date): boolean => {//a filter for the datepicker material, to dictate what dates are enabled
    if(this.hasOpHours){
      if(this.opDays.includes(d.toDateString().split(' ')[0])){ //if opdays DOW includes currday DOW, then valid
        return true
      }
      else{
        return false
      }
    }
    else{
      return true
    }
  }

   dateSelected(event: MatDatepickerInputEvent<Date>) {//triggers everytime a new date is slelected, updates the reservations for THAT day
    this.events.push(event.value); //add to events array
    //the currDateReservations array controls the reservations on the currently selected day
    this.currDateReservations = [] //everytime new day is selected,clear reservations array
    this.hasReservations = false //each date has no reservations by default (so appropriate message displays)
    this.selectedDate = true
    this.currSelectedDate = event.value.toLocaleDateString()
    const selectedDate = this.events[this.events.length-1].getUTCDate()+1; //the selected date, from the event
    this.reservationList.forEach(res =>{ //iterate through ALL reservations for ALL machines in curr space
      const reservedDate = new Date(parseInt(res.start)).getUTCDate(); //current reserverd date
      if(reservedDate == selectedDate){ //find those reservations that are on the currently selected date
        const resStart = new Date(parseInt(res.start)).toLocaleTimeString('en-us', { timeZone: 'GMT'})
        const resEnd = new Date(parseInt(res.end)).toLocaleTimeString('en-us', { timeZone: 'GMT'})
        const tempRes : Reservation = {
          start : resStart,
          end : resEnd,
          machine : res.machine,
          user : res.user,
          spaceID : res.spaceID,
        }
        this.hasReservations = true
        this.currDateReservations.push(tempRes)
      }
    })
  }
  editReservation(r : Reservation){
    const dialogRef = this.dialog.open(EditResComponent, {
      width: '450px',
      data: {spaceID : this.currID, resStart : r.start, resEnd : r.end, 
        machine: this.machine,currDateReservations : this.currDateReservations, 
        hasOphours: this.hasOpHours, hasResRestrictions : this.hasResRestrictions, 
        spaceOpen : this.spaceOpen, spaceClose:this.spaceClose,
        maxResLength : this.maxResLength, minResLength: this.minResLength,
        currDay : this.events[this.events.length-1], currEmail : this.currEmail
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.snackbar.open('Reload the page to see your new reservation!',"Dismiss",{duration:3000})
      this.getCurrReservations();
      console.log(this.reservationList.length)
      this.currDateReservations = []
      this.reservationList.forEach(res =>{ //iterate through ALL reservations for ALL machines in curr space
        const reservedDate = new Date(parseInt(res.start)).getUTCDate(); //current reserverd date
        if(reservedDate == this.events[this.events.length-1].getUTCDate()){ //find those reservations that are on the currently selected date
          const resStart = new Date(parseInt(res.start)).toLocaleTimeString('en-us', { timeZone: 'GMT'})
          const resEnd = new Date(parseInt(res.end)).toLocaleTimeString('en-us', { timeZone: 'GMT'})
          const tempRes : Reservation = {
            start : resStart,
            end : resEnd,
            machine : res.machine,
            user : res.user,
            spaceID : res.spaceID,
          }
          this.currDateReservations.push(tempRes)
        }
      })
    })
  }


  addReservation(m : string, date: Date, startTime : string, endTime : string){
    //once create res verifies input, this fucntionw will actually add the reservation to the databse
    var start = parseInt(startTime)
    var end = parseInt(endTime)
    //time in ms since jan 1 1970 (standard)
    var startD =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()+1,start)
    var endD = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()+1,end)
    
    this.tSubscription = this.firestore
    //a compound query (AND) is necesary so that the same machine in diff spaces is not touched
    .collection('machines',ref=>ref.where('machineName','==',m).where('spaceID','==',this.currID))
    .snapshotChanges()
    .subscribe(item=>{
      item.forEach(i =>{
        console.log(i.payload.doc.data())
         this.firestore.collection('machines').doc(i.payload.doc.id)
          .update(
            {dates: arrayUnion(startD+' '+this.currEmail +' ' +endD)})
            .then(
            (success)=>{
              this.snackbar.open('Successfully created reservation!','Dismiss',{duration:4000})
              if(!(this.hasReservations)){
                this.hasReservations = true
                /*you can only add reservations for the day youre looking at, 
                meaning if you add a res it will always be for the current day, 
                so the current day will always have res if it didnt already*/
              }
              const tempRes : Reservation = {
                start : new Date(startD).toLocaleTimeString('en-us', { timeZone: 'GMT'}),
                end : new Date(endD).toLocaleTimeString('en-us', { timeZone: 'GMT'}),
                machine : m,
                user : this.currEmail,
                spaceID : this.currID
              }
              this.currDateReservations.push(tempRes)
              })
              this.tSubscription.unsubscribe()
        })
    })
  }
  
  createRes(){//before adding reservation to database, this function checks to ensure reservation is valid
    var currDay = this.events[this.events.length-1]
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

        if(this.currDateReservations.length > 0){
        //get all reservations on current day, check if their times overlap with the selected 
        this.currDateReservations.forEach(d =>{
          let t = d.start //12 hour string 
          let y = t.split(' ')[0] //number
          let resStart = parseInt(y.split(':')[0]) //split HH:MM:YY to just HH
          let resStartAP = (t.split(' ')[1]) //AM/PM
          let u = d.end //12 hour string 
          let p = u.split(' ')[0] //number
          let resEnd = parseInt(p.split(':')[0])
          let resEndAP = (u.split(' ')[1]) //AM/PM
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
        )}
        else if (this.currDateReservations.length == 0){
          resOverlap = false
        }
      
      if(resOverlap){
        this.snackbar.open('Please ensure your reservation does not overlap with other reservations.','Dismiss',{duration :4000})
      }
      else{
        if(this.hasOpHours && !this.hasResRestrictions){
          if(selectedStart < this.spaceOpen){
            this.snackbar.open('Please ensure your start time is after the space opens!', 'Dismiss', {duration:4000})
          }
          else{
            if(selectedEnd > this.spaceClose){
              this.snackbar.open('Please ensure your end time is before the space closes!', 'Dismiss', {duration:4000})
            }
            else{
              this.snackbar.open('Working...', 'Dismiss', {duration:4000})
              this.addReservation(currMachine,currDay,selectedStart,selectedEnd)    
            }
          }   
        }
        
        else if(this.hasResRestrictions && !this.hasOpHours){
          if((selectedEnd-selectedStart) > this.maxResLength){
            this.snackbar.open('Please ensure your reservation is not longer than the allotted duration!', 'Dismiss', {duration:4000})
          }
          else{
            if((selectedEnd-selectedStart)<this.minResLength){
              this.snackbar.open('Please ensure your reservation is not shorter than the minimum duration!', 'Dismiss', {duration:4000})
            }
            else{
              this.snackbar.open('Working...', 'Dismiss', {duration:4000})
              this.addReservation(currMachine,currDay,selectedStart,selectedEnd)    
            }
          } 
        }

        else if(!this.hasOpHours && !this.hasResRestrictions){
          this.snackbar.open('Working...', 'Dismiss', {duration:4000})
          this.addReservation(currMachine,currDay,selectedStart,selectedEnd)

        }

        else if(this.hasOpHours && this.hasResRestrictions){
          if((selectedEnd-selectedStart) > this.maxResLength){
            this.snackbar.open('Please ensure your reservation is not longer than the allotted duration!', 'Dismiss', {duration:4000})
          }
          else{
            if((selectedEnd-selectedStart)<this.minResLength){
              this.snackbar.open('Please ensure your reservation is not shorter than the minimum duration!', 'Dismiss', {duration:4000})
            }
            else{
              if(selectedStart < this.spaceOpen){
                this.snackbar.open('Please ensure your start time is after the space opens!', 'Dismiss', {duration:4000})
              }
              else{
                if(selectedEnd > this.spaceClose){
                  this.snackbar.open('Please ensure your end time is before the space closes!', 'Dismiss', {duration:4000})
                }
                else{
                  this.snackbar.open('Working...', 'Dismiss', {duration:4000})
                  this.addReservation(currMachine,currDay,selectedStart,selectedEnd)  
                }
              }
            }
            }
        }
      }
      }
    }
  }

  getCurrReservations(){ //get all current space reservations
    this.reservationList = []
    this.resSubscription = this.firestore.collection('machines',ref=>ref.where('spaceID','==',this.currID))
    .snapshotChanges()
    .subscribe(item=>{
      item.forEach(i =>{
        const t = i.payload.doc.data() as machines
        if(t.dates.length > 0){
        let startD : string = '';
        let endD : string = '';
        let currUser : string = '';
        t.dates.forEach( d =>{
          startD = d.split(' ')[0]
          endD = d.split(' ')[2]
          currUser = d.split(' ')[1]
          const temp : Reservation = {
            start : startD, 
            end : endD, 
            machine : t.machineName, 
            user : currUser,
            spaceID : this.currID
          }
          this.reservationList.push(temp)
        })}
      })
      this.resSubscription.unsubscribe()
    })
  }
  ngOnDestroy(): void {
    this.machineSubscription.unsubscribe();
    this.resSubscription.unsubscribe();
    this.spaceSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.getCurrReservations()
    let c =0
    this.machineSubscription = this.firestore.collection('machines',ref=>(ref.where('spaceID','==',this.currID)))
    .snapshotChanges()
    .subscribe(item => 
      item.forEach(a =>{ 
              if(item.length == c){
                this.machineSubscription.unsubscribe();
              }
              else{
                const data = a.payload.doc.data(); 
                const id = a.payload.doc.id; 
                const temp =  {id, ...data as machines}
                if(temp.spaceID == this.currID){
                  this.machine.push(temp.machineName)
                  this.hasMachines = true
                }
                c++
              }
            }
          )
      );
      this.spaceSubscription = this.firestore.collection('spaces',ref=>ref.where('spaceID','==',this.currID))
      .doc(this.currID)
      .snapshotChanges()
      .subscribe(item =>{
        const tSpace = item.payload.data() as Space
        if(tSpace.hasOperatingDays){
          this.hasOpHours = true
          for(let i =0;i< tSpace.operatingDays.length; i++){
            this.operatingDays.push(this.weekday[tSpace.operatingDays[i]-1]) //array of string days of week space is open
            if(i==0){
              this.opDays +=this.weekday[tSpace.operatingDays[i]-1]
            }
            else{
              this.opDays += ', '+this.weekday[tSpace.operatingDays[i]-1]

            }
          }
            this.closeHour = tSpace.endTime
            this.openHour = tSpace.startTime
            if(tSpace.startAP == 2){
              this.sAP = 'PM'
              this.spaceOpen = tSpace.startTime*1 + 12

            }
            else{
              this.sAP = 'AM'
              this.spaceOpen = tSpace.startTime*1 

            }
            if(tSpace.endAP == 2){
              this.eAP = 'PM'
              this.spaceClose = tSpace.endTime*1 +12

            }
            else{
              this.eAP = 'AM'
              this.spaceClose = tSpace.endTime*1 
            }
        }
        if(tSpace.startTime){
          this.hasResRestrictions = true
          this.minResLength = tSpace.minResLength
          this.maxResLength = tSpace.maxResLength
        }
      })
  }
  selected: Date | null;
}

/*

                <div *ngIf="hasReservations">
                    <mat-card *ngFor="let r of currDateReservations">
                        <mat-card-content>
                            <p>
                                Machine: {{r.machine}}
                            </p>
                            <p>
                                User: {{r.user}}
                            </p>
                            <p>
                                Starting time: {{r.start}}
                            </p>
                            <p>
                                Ending time: {{r.end}}
                            </p>
                        </mat-card-content>
                        <mat-card-actions *ngIf="r.user==currEmail">
                            <button mat-raised-button (click)="editReservation(r)">Edit</button>
                        </mat-card-actions>
                    </mat-card> 
                </div>
                */