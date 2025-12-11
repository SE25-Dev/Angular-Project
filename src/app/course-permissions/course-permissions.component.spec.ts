import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePermissionsComponent } from './course-permissions.component';

describe('CoursePermissionsComponent', () => {
  let component: CoursePermissionsComponent;
  let fixture: ComponentFixture<CoursePermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursePermissionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoursePermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
