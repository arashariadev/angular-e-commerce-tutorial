import { HttpClient } from '@angular/common/http';
import { Product } from './products';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cartCount = new BehaviorSubject<number>(0);
  private _cartCount$ = this._cartCount.asObservable();
  items: Product[] = []; 
  constructor(private httpClient: HttpClient) {}

  addToCart(product: Product) {
    this.items.push(product);
    this.setCartCount();
  }

  getItems() {
    return this.items;
  }

  getTotalPrice() {
    let total = 0;
    this.items.forEach(item => {
      total += item.price;
    });
    return total;
  }

  isEmptyCart() {
    return this.items.length == 0;
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

  getShippingPrices() {
    return this.httpClient.get<{ type: string; price: number }[]>(
      '/assets/shipping.json'
    );
  }

  getCartCount(): Observable<number> {
    return this._cartCount$;
  }

  setCartCount() {
    return this._cartCount.next(this.items.length);
  }
}
