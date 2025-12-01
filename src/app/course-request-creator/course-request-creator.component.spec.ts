import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRequestCreatorComponent } from './course-request-creator.component';

describe('CourseRequestCreatorComponent', () => {
  let component: CourseRequestCreatorComponent;
  let fixture: ComponentFixture<CourseRequestCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseRequestCreatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourseRequestCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
