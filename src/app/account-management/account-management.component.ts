import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth } from 'firebase/auth';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountComponent } from '../delete-account/delete-account.component';
import { UserStateService } from '../user-state.service';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit {
  public currUserName : any = null
  public userPicture : any = null

  constructor(private dialog: MatDialog, private auth: AngularFireAuth, private service : UserStateService) {

   }
  async logout() {
    return this.auth.signOut().then(() => {
      window.location.href = ""
    })
  }
  deleteAccount() {
   this.dialog.open(DeleteAccountComponent);
  }

  ngOnInit(): void {
    this.currUserName = getAuth().currentUser?.displayName
    this.userPicture = getAuth().currentUser?.photoURL

  }

}

