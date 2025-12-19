import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseRequestCreatorComponent } from './course-request-creator/course-request-creator.component';
import { CourseCreationRequestsComponent } from './course-creation-requests/course-creation-requests.component';

import { CourseComponent } from './course/course.component';

import { authGuard } from './auth.guard';
import { isSuperuserGuard } from './is-superuser.guard';
import { NotificationsComponent } from './notifications/notifications.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [authGuard], // optional
  },
  {
    path: 'courses',
    component: CoursesComponent,
   // canActivate: [authGuard],
  },
  {
    path: 'course/:id',
    component: CourseComponent,
    canActivate: [authGuard], // optional
  },
  {
    path: 'course-request-creator',
    component: CourseRequestCreatorComponent,
    canActivate: [authGuard],
  },
  {
    path: 'course-creation-requests',
    component: CourseCreationRequestsComponent,
    canActivate: [isSuperuserGuard],
  },
  { path: '', component: HomeComponent },

  { path: '**', redirectTo: '' },
];
