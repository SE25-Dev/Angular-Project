import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPresenceComponent } from './session-presence.component';

describe('SessionPresenceComponent', () => {
  let component: SessionPresenceComponent;
  let fixture: ComponentFixture<SessionPresenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionPresenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessionPresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
