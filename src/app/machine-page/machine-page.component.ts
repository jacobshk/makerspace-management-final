import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { getAuth } from "firebase/auth";
import { UserStateService, machines, Space } from '../user-state.service';
import { Router } from '@angular/router';
import { SpacePageComponent } from '../space-page/space-page.component';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EditResComponent } from '../edit-res/edit-res.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditMacComponent } from '../edit-mac/edit-mac.component';
import { DeleteMacComponent } from '../delete-mac/delete-mac.component';
@Component({
  selector: 'app-machine-page',
  templateUrl: './machine-page.component.html',
  styleUrls: ['./machine-page.component.css']
})
export class MachinePageComponent implements OnInit, OnDestroy {
  hostPerm : Boolean = false
  public hasMachines : Boolean 
  public machine : machines[] = []
  public mID : string[] = []
  public listSpaces : Space[];
  machinesSubscription : Subscription
  currEmail = getAuth().currentUser?.email
  m : Observable<any[]>;
  currID : string
  spaceSub : Subscription;
  constructor(private snackBar : MatSnackBar, private dialog: MatDialog, private perms : SpacePageComponent, private service : UserStateService, private router : Router, private firestore: AngularFirestore) { 
    this.currID = this.router.url.substring(1,this.router.url.length)
  }
  addMachines(){
    window.location.href =  this.currID+'/addmachine'
  }
  
  edit(m : machines){
    const dialogRef = this.dialog.open(EditMacComponent, {
      width: '250px',
      data: {spaceID : this.currID, machine : m}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.machine = []
      this.mID = []
      this.machinesSubscription.unsubscribe()
      this.hasMachines = false;
      this.machinesSubscription = this.firestore.collection('machines', ref=>ref.where('spaceID','==',this.currID))
        .snapshotChanges()
        .subscribe(item=>{
            item.forEach(e =>{
              const temp = e.payload.doc.data() as machines
                this.machine.push(temp)
                const t = e.payload.doc.id
                this.mID.push(t)
                this.hasMachines = true
            })
          })    });
  }
  delete(m : machines){
    const dialogRef = this.dialog.open(DeleteMacComponent, {
      width: '250px',
      data: {spaceID : this.currID, machine : m}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.machine = []
      this.mID = []
      this.machinesSubscription.unsubscribe()
      this.hasMachines = false;
      this.machinesSubscription = this.firestore.collection('machines', ref=>ref.where('spaceID','==',this.currID))
        .snapshotChanges()
        .subscribe(item=>{
            item.forEach(e =>{
              const temp = e.payload.doc.data() as machines
                this.machine.push(temp)
                const t = e.payload.doc.id
                this.mID.push(t)
                this.hasMachines = true
            })
          })    });
    
    this.machine = []
    this.mID = []
    this.machinesSubscription.unsubscribe()
    this.hasMachines = false;
    this.machinesSubscription = this.firestore.collection('machines', ref=>ref.where('spaceID','==',this.currID))
      .snapshotChanges()
      .subscribe(item=>{
          item.forEach(e =>{
            const temp = e.payload.doc.data() as machines
              this.machine.push(temp)
              const t = e.payload.doc.id
              this.mID.push(t)
              this.hasMachines = true
          })
        })
  }
  editMachine(m: machines){
    const dialogRef = this.dialog.open(EditMacComponent, {
      width: '250px',
      data: {spaceID : this.currID, machine : m}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.machinesSubscription = this.firestore.collection('machines', ref=>ref.where('spaceID','==',this.currID))
      .snapshotChanges()
      .subscribe(item=>{
          item.forEach(e =>{
            const temp = e.payload.doc.data() as machines
            const t = e.payload.doc.id
              this.machine.push(temp)
              this.mID.push(t)
              this.hasMachines = true
          })
          this.machinesSubscription.unsubscribe()
        });
      })
  }
  ngOnDestroy(): void {
      this.machinesSubscription.unsubscribe()
      this.spaceSub.unsubscribe()
  }
  
  ngOnInit(): void {
    this.spaceSub = this.firestore
    .collection('spaces').doc(this.currID)
    .snapshotChanges().subscribe(y => {
          const data = y.payload.data(); 
          const id = y.payload.id; 
          const currSpace =  {id, ...data as Space}
          if(currSpace.email == this.currEmail){
            this.hostPerm = true
          }
          this.spaceSub.unsubscribe()
      });
      this.machinesSubscription = this.firestore.collection('machines', ref=>ref.where('spaceID','==',this.currID))
      .snapshotChanges()
      .subscribe(item=>{
          item.forEach(e =>{
            const temp = e.payload.doc.data() as machines
            const t = e.payload.doc.id
              this.machine.push(temp)
              this.mID.push(t)
              this.hasMachines = true
          })
          this.machinesSubscription.unsubscribe()

        })}

}