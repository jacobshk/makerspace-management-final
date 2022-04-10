import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserStateService, Space, User } from '../user-state.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAuth } from 'firebase/auth';
import { Observable, Subscription } from 'rxjs';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { MatDialog } from '@angular/material/dialog';
import { RenameSpaceDialogComponent } from '../rename-space-dialog/rename-space-dialog.component';
import { TransferOwnerComponentComponent } from '../transfer-owner-component/transfer-owner-component.component';
import { DeleteSpaceComponent } from '../delete-space/delete-space.component';
import { ChangeSpaceHoursComponent } from '../change-space-hours/change-space-hours.component';
import { ChangeReservationRequirementsComponent } from '../change-reservation-requirements/change-reservation-requirements.component';

@Component({
  selector: 'app-space-info',
  templateUrl: './space-info.component.html',
  styleUrls: ['./space-info.component.css']
})
export class SpaceInfoComponent implements OnInit, OnDestroy {
  spaceSubscription : Subscription;
  userSubscription : Subscription;
  hostSubscription : Subscription;
  uSubscription : Subscription;
  member : User[] = [];
  currOwner : string = ''
  currID : string = ''
  currSpaceName : string=''
  startHour : number=0;
  endHour : number=0;
  sAP : string='';
  eAP : string =''; 
  hasOpHours : Boolean = false;
  hasResConstraints : Boolean = false;
  uid : string
  sid : string | undefined
  auxUID : string | undefined
  public hasPermission : boolean = false;
  public hasMembers : Boolean = false;
  minResLength : number = 0;
  maxResLength : number = 0;
  opDays : string = ''
  currSpaceID : string
  email = getAuth().currentUser?.email
  
  weekday=new Array(7);
  constructor(private snackBar : MatSnackBar,private firestore : AngularFirestore, private router : Router, private service : UserStateService, private dialog: MatDialog) { 
    this.currID = this.router.url.substring(1,this.router.url.length)
    this.service.getCurrUserDocID(); //updates service's listusers on initial page render
    this.service.getCurrSpaceDocID(); 
    this.currSpaceID = this.router.url.substring(1,this.router.url.length)
    this.weekday[0]="Mon";
    this.weekday[1]="Tue";
    this.weekday[2]="Wed";
    this.weekday[3]="Thu";
    this.weekday[4]="Fri";
    this.weekday[5]="Sat";
    this.weekday[6]="Sun";

  }
  setTime(){
    const dialogRef = this.dialog.open(ChangeSpaceHoursComponent, {
      width: '75vw',
      data: {spaceID : this.currID, spaceName: this.currSpaceName},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  
  removePerson(m : User){
    try{
    //find user's doc, remove this space from their joined spaces
    this.uSubscription = this.firestore.collection('users',ref=>ref.where('email','==',this.email)).snapshotChanges().subscribe(
      item=>{
        item.forEach(i=>{
          const t = i.payload.doc.id
          this.firestore.collection('users').doc(t)
          .update({
            joinedSpaces: arrayRemove(this.currID)
          }) 
        })
      }
    ) 
    //find space doc, remove this user from joined users
    this.firestore.collection('spaces').doc(this.currID)
   .update({
     joinedUsers: arrayRemove(m.email)
   }).then(
     success=>{
      this.snackBar.open('Successfully removed '+m, 'Dismiss', {duration: 3000});
     }
     ,failure =>{
      this.snackBar.open('Something went wrong!', 'Dismiss', {duration: 3000});

     }
   )

  }
  catch(err){
    this.snackBar.open('Something went wrong! Error code: '+err, 'Dismiss', {duration: 3000});

  }

  }
  setRes(){
    const dialogRef = this.dialog.open(ChangeReservationRequirementsComponent, {
      width: '50vw',
      data: {spaceID : this.currID, spaceName: this.currSpaceName},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  deleteSpace(){
    const dialogRef = this.dialog.open(DeleteSpaceComponent, {
      width: '250px',
      data: {spaceID : this.currID, spaceName: this.currSpaceName},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  transferOwner(){
    const dialogRef = this.dialog.open(TransferOwnerComponentComponent, {
      width: '250px',
      data: {spaceID : this.currID, spaceName: this.currSpaceName},
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  renameSpace(){
    const dialogRef = this.dialog.open(RenameSpaceDialogComponent, {
      width: '250px',
      data: {spaceID : this.currID, spaceName: this.currSpaceName},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  

  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.spaceSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.userSubscription = this.firestore.collection('users',ref=>(ref.where('spacesJoined','array-contains',this.currID)))
    .snapshotChanges()
    .subscribe(item=>{
      item.forEach(s=>{
        const t = s.payload.doc.data() as User
        this.member.push(t)
      })
    })

    this.spaceSubscription =  this.firestore
    .collection('spaces',ref=>(ref.where('spaceID','==',this.currID)))
    .snapshotChanges()
    .subscribe(item =>{
      item.forEach(i=>{
        const tempCurrSpace = i.payload.doc.data() as Space
        this.currSpaceName = tempCurrSpace.spaceName;
        this.currOwner = tempCurrSpace.hostName;
        if(tempCurrSpace.email == this.email){
          this.hasPermission = true;
        }
        if(tempCurrSpace.operatingDays){
          this.opDays = ' '
          for(let i =0;i< tempCurrSpace.operatingDays.length; i++){
            if(this.weekday[tempCurrSpace.operatingDays[i]]){
            if(i==0){
              this.opDays +=this.weekday[tempCurrSpace.operatingDays[i]-1]
            }
            else{
              this.opDays += ', '+this.weekday[tempCurrSpace.operatingDays[i]-1]
            }
          }
          }
        }
        if(tempCurrSpace.endAP){//if operating hours have been set, and op hour fields have been created
          this.startHour = tempCurrSpace.startTime;
          this.endHour = tempCurrSpace.endTime;
          if(tempCurrSpace.startAP ==1){
            this.sAP = 'AM'
          }
          else if(tempCurrSpace.startAP ==2){
            this.sAP='PM'
          }
          if(tempCurrSpace.endAP ==1){
            this.eAP = 'AM'
          }
          else if(tempCurrSpace.endAP ==2){
            this.eAP='PM'
          }
          this.hasOpHours = true
          if(tempCurrSpace.minResLength){
            this.hasResConstraints = true
            this.minResLength = tempCurrSpace.minResLength;
            this.maxResLength = tempCurrSpace.maxResLength;
          }
        }
        if(tempCurrSpace.joinedUsers.length ==0){
          this.hasMembers = false
        }
        else if(tempCurrSpace.joinedUsers.length > 0){
          this.hasMembers = true
        }

      })
    })
  }

}
