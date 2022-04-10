import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from "firebase/auth";
import { UserStateService, Space, User } from '../user-state.service';
import { ChangeDetectorRef } from '@angular/core';
import { collection, query, where, getDocs } from "firebase/firestore";
@Component({
  selector: 'app-new-viewspaces',
  templateUrl:'./new-viewspaces.component.html',
  styleUrls: ['./new-viewspaces.component.css']
})

export class NewViewspacesComponent implements OnInit, OnDestroy {
  spacesJoined : Space[] = [];
  spacesCreated : Space[] = [];
  public joinsSpaces : boolean 
  public ownsSpaces : boolean 
  currEmail : string = getAuth().currentUser.email
  spaceOwnedSubscription : Subscription ;
  spaceJoinedSubscription : Subscription ;
  currSpaceID : string;
  constructor(private changeDetector: ChangeDetectorRef,private firestore: AngularFirestore, ) {
  }
  getSpacesFromFirebase(){
    this.spacesCreated = []
    this.spacesJoined = []
    //owned spaces logic
    let t = 0
    this.spaceOwnedSubscription = this.firestore
    .collection('spaces', ref=>ref.where('email','==',this.currEmail))
    .snapshotChanges()
    .subscribe(item =>{
      item.forEach(y =>{
        if(t<item.length){
          this.ownsSpaces = true

          const data = y.payload.doc.data(); 
          const id = y.payload.doc.id; 
          const x = {id, ...data as Space}
          this.spacesCreated.push(x)
          t++;
        }
        else{
          this.ownsSpaces = true
          this.spaceOwnedSubscription.unsubscribe();
          
        }
        
      })
      
    })
    //joined spaces logic 
    //simpler to access spaces collcetion rather than users b/c a space objcet is needed for ngfor
    let c = 0;
    this.spaceJoinedSubscription = this.firestore
    .collection('spaces', ref=>ref.where('joinedUsers','array-contains',this.currEmail))
    .snapshotChanges().subscribe(item =>{
      item.forEach(x =>{
        const t = x.payload.doc.data() as Space
        if(c < item.length){
          c++
          if(!(this.spacesJoined.includes(t))){
            this.spacesJoined.push(t)
            this.joinsSpaces = true
          }
        }
        else{
          this.spaceJoinedSubscription.unsubscribe()
        }
      })
    });
  }
 
  viewOwnedSpace(C : any){
      this.currSpaceID = C.spaceID
      window.location.href =  this.currSpaceID
  }
  viewJoinedSpace(card : any){
    this.currSpaceID = card.spaceID
    window.location.href =  this.currSpaceID
}
  
  ngOnDestroy() : void {
    this.spaceOwnedSubscription.unsubscribe()
    this.spaceJoinedSubscription.unsubscribe()
  }
  ngOnInit(): void {
    this.getSpacesFromFirebase();
  }
}