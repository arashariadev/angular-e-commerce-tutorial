import { TestBed } from '@angular/core/testing';

import { DynamicBreadcrumbService } from './dynamic-breadcrumb.service';

describe('DynamicBreadcrumbService', () => {
  let service: DynamicBreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicBreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
