import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { CoursesComponent } from './dashboard/courses.component';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [authGuard]
  },

  { path: '', component: HomeComponent }

  { path: '**', redirectTo: '' }
];
