import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { AddTaskComponent } from './components/add-task/add-task';

import { RegisterComponent } from './components/register/register'; 

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'add-task', component: AddTaskComponent },
  { path: 'register', component: RegisterComponent }, 
  { path: '**', redirectTo: '' }
];
