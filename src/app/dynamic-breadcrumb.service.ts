import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicBreadcrumbService {
  // BehaviorSubject act as a single store to hold updated shared data
  breadcrumbLabels: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor() { }

  getBreadCrumbLabels(): Observable<any[]> {
    return this.breadcrumbLabels.asObservable();
  }

  // update breadcrumb data property defined in route configuration
  updateBreadCrumbLabels(labels: any) {
    this.breadcrumbLabels.next(labels);
  }
}
