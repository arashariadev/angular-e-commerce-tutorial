import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { IBreadCrumb } from './breadcrumb.model';
import { DynamicBreadcrumbService } from '../dynamic-breadcrumb.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-breadcrumb',
  templateUrl: './dynamic-breadcrumb.component.html',
  styleUrls: ['./dynamic-breadcrumb.component.css']
})
export class DynamicBreadcrumbComponent implements OnInit {

  breadcrumbs: IBreadCrumb[] = [];
  // create a subject to unsubscribe multiple subscriptions at once
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dynamicBreadcrumbService: DynamicBreadcrumbService
  ) {
    this.InitBreadCrumb();
  }

  ngOnInit() {
    this.dynamicBreadcrumbService.getBreadCrumbLabels()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dynamicLabels) => {
        // dynamicLabels: { Key:value } defined using DynamicBreadcrumbService
        for (const label in dynamicLabels) {
          this.breadcrumbs.map((crumb) => {
            // match {{LABEL}} patterns
            const matchedLabelParams = crumb.label.match(/[^{{]+(?=\}})/g);
            if (matchedLabelParams) {
              for (const labelParam of matchedLabelParams) {
                if (labelParam === label) {
                  const dynamicLabel = dynamicLabels[label];
                  crumb.label = crumb.label.replace('{{' + labelParam + '}}', dynamicLabel);
                }
              }
            }
          });
        }
      });
  }

  ngOnDestroy() {
    // unsubscribe all subscriptios that inside ngOnInit hook to prevent memory leak
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  InitBreadCrumb(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
      });
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {
    //If no routeConfig is avalailable we are on the root path
    let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data['breadcrumb'] : '';
    let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

    // If the route is dynamic route such as ':id', remove it
    const lastRoutePart = path?.split('/').pop();
    const isDynamicRoute = lastRoutePart?.startsWith(':');
    if (isDynamicRoute && !!route.snapshot && lastRoutePart && path) {
      const paramName = lastRoutePart.split(':')[1];
      path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
      // label = route.snapshot.params[paramName];
    }

    //In the routeConfig the complete path is not available,
    //so we rebuild it each time
    const nextUrl = path ? `${url}/${path}` : url;
    const breadcrumb: IBreadCrumb = {
      label: label,
      url: nextUrl,
    };

    // Only adding route with non-empty label
    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];

    if (route.firstChild) {
      //If we are not on our current path yet,
      //there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
