import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { appConfig } from './app/app.config';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
