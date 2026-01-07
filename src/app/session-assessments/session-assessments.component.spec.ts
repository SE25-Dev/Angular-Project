import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionAssessmentsComponent } from './session-assessments.component';

describe('StudentAssessmentComponent', () => {
  let component: SessionAssessmentsComponent;
  let fixture: ComponentFixture<SessionAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionAssessmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessionAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
