# angular-e-commerce-tutorial

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/angular-i9jh2f-pbe6mm)

# Getting started with Angular

[Follow the official tutorial](https://angular.io/start) to learn the basic of Angular, following best practices.

# Add-on Features/Functionalities
- Add `isEmptyCart` method in `CartService` to able to check if current cart is empty
- Add `getTotalPrice` method in `CartService` to display total of orders
- Add `getCartCount` and `setCartCount` in `CartService` to display cart count in top bar
- Conditional template rendering in `Cart` template based on `isEmptyCart`
- CSS update
- Add breadcrumb based on [this post written by Zhiyue Yi](https://dev.to/zhiyueyi/create-a-simple-breadcrumb-in-angular-ag5). I made some additional updates on this part:
    - A `DynamicBreadcrumbService` is added to declaratively specify the breadcrumb label by injecting this service
    - Unsubscribe subscriptios in `ngOnDestroy` hook to avoid **memory leak** issue (credit to [Kristiqn Tachev's comment](https://dev.to/dipteekhd/angular-behaviorsubject-p1#comment-1jc17))

## Dynamic Breadcrumb view and service example

Let's use the example from [Angular Getting started example](https://angular.io/start#take-a-tour-of-the-example-application). Next, create a breadcrumb like `Products > Phone XL` when we in specified product detail page. Notice that the latter part `Phone XL` actually comes from `{{productName}}` defines in angular routers. We can go back to products page when `Products` is clicked.

1. Structure angular routes and add corresponding `breadcrumb` properties in the routes's `data`. In this case, add `breadcrumb: 'Products'` to path `/products`, and `breadcrumb: '{{productName}}'` to path `/products/:productId`.

```ts
const routes: Routes = [
  // other routes ...
  {
    path: 'products', 
    data: {
      breadcrumb: 'Products',
    },
    children: [
      {
        path: '',
        component: ProductListComponent,
      },
      {
        path: ':productId',
        component: ProductDetailsComponent,
        data: {
          breadcrumb: '{{productName}}',
        }
      }
    ]
  }
]
```

2. Inject `DynamicBreadcrumbService` service in the component you want. In this case, we inject the service into `ProductDetailsComponent`

```ts
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;

  constructor(
    private route: ActivatedRoute,
    private dynamicBreadcrumbService: DynamicBreadcrumbService
  ) { }
}
```

3. Set the value `productName` using `DynamicBreadcrumbService`

```ts
export class ProductDetailsComponent implements OnInit {
  product?: Product;

  constructor(
    // other service ...
    private dynamicBreadcrumbService: DynamicBreadcrumbService
  ) { }

  ngOnInit(): void {
    // other code ...

    // Update breadcrum dynamically
    const breadcrumbLabel = { productName: this.product?.name };
    this.dynamicBreadcrumbService.updateBreadCrumbLabels(breadcrumbLabel);
  }
}
```
