import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatExpansionModule} from '@angular/material/expansion';

import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { SignedinComponent } from './signedin/signedin.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PERSISTENCE } from '@angular/fire/compat/auth';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CreateSpaceComponent } from './create-space/create-space.component';
import { MatStepperModule} from '@angular/material/stepper';
import { FlexLayoutModule} from '@angular/flex-layout';
import { JoinSpaceComponent } from './join-space/join-space.component';
import { MatDialogModule} from '@angular/material/dialog';
import { MatCheckboxModule} from '@angular/material/checkbox';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NewViewspacesComponent } from './new-viewspaces/new-viewspaces.component';
import { AddMachineComponent } from './add-machine/add-machine.component';
import { SpacePageComponent } from './space-page/space-page.component';
import { AccountManagementComponent } from './account-management/account-management.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { MachinePageComponent } from './machine-page/machine-page.component';
import { MachineCalendarComponent } from './machine-calendar/machine-calendar.component';
import { SpaceInfoComponent } from './space-info/space-info.component';
import { RenameSpaceDialogComponent } from './rename-space-dialog/rename-space-dialog.component';
import { TransferOwnerComponentComponent } from './transfer-owner-component/transfer-owner-component.component';
import { DeleteSpaceComponent } from './delete-space/delete-space.component';
import { ChangeSpaceHoursComponent } from './change-space-hours/change-space-hours.component';
import { ChangeReservationRequirementsComponent } from './change-reservation-requirements/change-reservation-requirements.component';
import { EditResComponent } from './edit-res/edit-res.component';
import { EditMacComponent } from './edit-mac/edit-mac.component';
import { DeleteMacComponent } from './delete-mac/delete-mac.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    SignedinComponent,
    CreateSpaceComponent,
    JoinSpaceComponent,
    NewViewspacesComponent,
    AddMachineComponent,
    SpacePageComponent,
    AccountManagementComponent,
    DeleteAccountComponent,
    MachinePageComponent,
    MachineCalendarComponent,
    SpaceInfoComponent,
    RenameSpaceDialogComponent,
    TransferOwnerComponentComponent,
    DeleteSpaceComponent,
    ChangeSpaceHoursComponent,
    ChangeReservationRequirementsComponent,
    EditResComponent,
    EditMacComponent,
    DeleteMacComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    FlexLayoutModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatRadioModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTabsModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule, 
    AppRoutingModule,
  ],
  providers: [
    {provide:PERSISTENCE, useValue:'session'}
  ],


  bootstrap: [AppComponent]
})
export class AppModule { }
