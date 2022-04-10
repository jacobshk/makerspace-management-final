import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup} from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserStateService } from '../user-state.service';


@Component({
  selector: 'app-add-machine',
  templateUrl: './add-machine.component.html',
  styleUrls: ['./add-machine.component.css']
})

export class AddMachineComponent implements OnInit {
  private currID : string
   
  machineFormGroup = new FormGroup({
    machineControl : new FormControl('', [Validators.required, Validators.minLength(1)]), //machines in the space 
    materialControl : new FormControl('', [Validators.required, Validators.minLength(1)]), //machine materials 
    descControl : new FormControl('', [Validators.required, Validators.minLength(1)]), //machine desc 

  });

  constructor(private router : Router, private snackbar : MatSnackBar, private firestore : AngularFirestore, private service : UserStateService) {
    this.currID = this.router.url.substring(1,(this.router.url.length-11))
  }

  saveMachine() { //create new machine doc in machines collection
    if(this.machineFormGroup.valid){
      try{
      this.firestore.collection('machines').add({
            material: this.machineFormGroup.value.materialControl,
            machineName: this.machineFormGroup.value.machineControl,
            dates : [],
            description : this.machineFormGroup.value.descControl,
            spaceID : this.currID
        }).then(
          sucess =>{
            this.snackbar.open('Success! Machine added to space', 'Dismiss', {duration:4000});
            this.machineFormGroup.reset();
          },
          failure =>{
            this.snackbar.open('Uh oh, something went wrong!', 'Dismiss', {duration:4000});
          }
        )

      }
      catch(err){
        console.log(err)
        this.snackbar.open('Uh oh, something went wrong! Error:'+err, 'Dismiss', {duration: 3000});

      }
    }
    else{
      this.snackbar.open('Uh oh, something\'s wrong with your input!', 'Dismiss', {duration: 3000});
    }
  }

  goBack(){
    window.location.href =  this.currID
  }
   

  ngOnInit(): void {
    
  }

}
