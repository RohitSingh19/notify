import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { NewNoteComponent } from '../notes/new-note/new-note.component';
import { HomeComponent } from '../home/home.component';
import { AuthGaurd } from '../auth/auth.gaurd';
import { WorkbookComponent } from '../workbook/workbook.component';
import { CalenderComponent } from '../calender/calender.component';
import { UserProfileComponent } from '../auth/user-profile/user-profile.component';


const appRoutes: Routes = [
    {path: '', redirectTo: 'home/:uid' , pathMatch: 'full'},
    {path: 'auth/login', component: LoginComponent},
    {path: 'auth/signup', component: SignupComponent},
    {path: 'new', component: NewNoteComponent},
    {path: 'home/:uid', component: HomeComponent, children: [
        {path: '', component: NewNoteComponent},
        {path: ':noteId', component: WorkbookComponent}
    ]},
    {path: 'calendar/:uid', component: CalenderComponent},
    {path: 'user-profile/:uid', component: UserProfileComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}


// , canActivate: [AuthGaurd]