import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, OnInit } from '@angular/core';
import { NewViewspacesComponent } from '../new-viewspaces/new-viewspaces.component';
import { ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-signedin',
  templateUrl: './signedin.component.html',
  styleUrls: ['./signedin.component.css']
})
export class SignedinComponent implements OnInit {
  public currUserName : any = null
  public date : any = null
  public isLoggedIn : boolean = false
  public viewEnabled : boolean = true

  @ViewChild(NewViewspacesComponent) 
  childRef : NewViewspacesComponent
  viewSpace : NewViewspacesComponent
  constructor( public auth : AngularFireAuth, private changeDetector: ChangeDetectorRef) {
    auth.authState.subscribe( user =>{
      if(user){
        this.isLoggedIn = true
        this.currUserName = user.displayName
        var today = new Date();
        this.date = today.toTimeString();
    
      }
    })
  }
  
  async SignOut() {
    return this.auth.signOut().then(() => {
      window.location.href = ""
    })
    
  }
  clearSpaces(){
    this.viewEnabled = false;
    // now notify angular to check for updates
    this.changeDetector.detectChanges();
    
    // change detection should remove the component now
    // then we can enable it again to create a new instance
    this.viewEnabled = true;   
}
  onTabChanged() {
    this.clearSpaces()
  }
  ngOnInit(): void {

  }

}
