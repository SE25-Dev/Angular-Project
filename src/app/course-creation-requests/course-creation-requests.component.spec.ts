import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCreationRequestsComponent } from './course-creation-requests.component';

describe('CourseCreationRequestsComponent', () => {
  let component: CourseCreationRequestsComponent;
  let fixture: ComponentFixture<CourseCreationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCreationRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourseCreationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
