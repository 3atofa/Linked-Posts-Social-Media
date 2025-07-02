import { Routes } from '@angular/router';
import path from 'path';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/Auth/login/login.component';
import { loggedInGuard } from './core/guards/LoggedIn/logged-in.guard';
import { RegisterComponent } from './pages/Auth/register/register.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './core/guards/Auth/auth.guard';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},

    {path:"", component:AuthLayoutComponent, canActivate:[loggedInGuard] ,children:[
        {path: 'login', component: LoginComponent, title: 'Login'},
        {path: 'register', component: RegisterComponent, title: 'Register'},
    ]}, 

    {path:'', component:BlankLayoutComponent, canActivate:[authGuard],  children:[
        {path:'home', component:HomeComponent, title: 'Home'},
        {path:'profile', component:UserProfileComponent, title: 'Profile'}
    ]},

    {path: '**', redirectTo: '/home', pathMatch: 'full'}
];
