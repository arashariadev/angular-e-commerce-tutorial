import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, products } from '../products';
import { CartService } from '../cart.service';
import { DynamicBreadcrumbService } from '../dynamic-breadcrumb.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private dynamicBreadcrumbService: DynamicBreadcrumbService
  ) { }

  ngOnInit(): void {
    // Get the product id from the current route
    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute = Number(routeParams.get('productId'));

    // Find the product that correspond with the id provided in route
    this.product = products.find(
      (product) => product.id === productIdFromRoute
    );

    // Update breadcrum dynamically
    const breadcrumbLabel = { productName: this.product?.name };
    this.dynamicBreadcrumbService.updateBreadCrumbLabels(breadcrumbLabel);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    window.alert('Your product has been added to the cart!');
  }
}
