import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicBreadcrumbComponent } from './dynamic-breadcrumb.component';

describe('DynamicBreadcrumbComponent', () => {
  let component: DynamicBreadcrumbComponent;
  let fixture: ComponentFixture<DynamicBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicBreadcrumbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
