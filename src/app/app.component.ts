import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  constructor(private matIconRegistry: MatIconRegistry) {}

  ngOnInit(): void {
    this.matIconRegistry.setDefaultFontSetClass('material-symbols-rounded');
  }
}
