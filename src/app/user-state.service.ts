import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from "firebase/auth";
import { map } from 'rxjs/operators';
import { collection, getDocs } from "firebase/firestore";

export interface User { 
  userDocID? : string,
  email : string,
  spacesCreated : Array<string>,
  spacesJoined : Array<string>,
  user : string,
  userid : string
}

 
export interface machines { 
  dates : Array<string>,
  machineName : string,
  material : Array<string>,
  description : string,
  spaceID : string,
  mDocID?: string,
}
export interface Reservation {
  start : string,
  end : string,
  machine : string,
  user : string,
  spaceID : string,
}
export interface Space { 
  spaceDocID? : string,
  hasOperatingDays? : boolean,
  hasResRestrictions? : boolean,
  coOwners : Array<string>,
  email : String,
  hostName : string,
  joinedUsers : Array<string>,
  spaceAddress? : string,
  spaceID : string,
  spaceName : string ,
  endAP? : number,
  endTime? : number,
  operatingDays? : Array<number>,
  startAP? : number,
  startTime? : number,
  minResLength? : number,
  maxResLength? : number,
}
@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  listUsers : User[] = [] 
  listSpaces : Space[] = [] 
  fire

  constructor(private firestore : AngularFirestore) {
    this.fire = this.firestore.collection('spaces')
  }
    getSpaces() {
      return this.firestore.collection('spaces').snapshotChanges();

    }
    getUsers() {
      return this.firestore.collection('users').snapshotChanges();
    }
    getCurrUser(){
      const auth = getAuth();
      return(auth.currentUser?.email)
    }
     getCurrUserDocID(){
      this.getUsers().subscribe(arr =>{
         this.listUsers = arr.map(item => {
           return{
            userDocID : item.payload.doc.id,
            ...item.payload.doc.data() as User
           }
        })
      }) 

      return{        
        userIDs : this.listUsers
      };
    }
    
    async getCurrSpaceDocID(){ 
      this.getSpaces().subscribe(arr =>{
         this.listSpaces = arr.map(item => {
           return{
            spaceDocID : item.payload.doc.id,
            ...item.payload.doc.data() as Space
           }
        })
      }) 

      return{        
        userIDs : this.listSpaces
      };
    }
}
