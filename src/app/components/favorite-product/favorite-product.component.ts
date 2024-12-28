import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';
import { Favorite, FavoriteService } from '../../services/favorite.service';
import { UserResponse } from '../../responses/user/user.response';
import { Product } from '../../models/product';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ProductCartComponent } from '../product-cart/product-cart.component';

@Component({
  selector: 'app-favorite-product',
  standalone: true,
  imports: [ProductCartComponent, CommonModule],
  templateUrl: './favorite-product.component.html',
  styleUrls: ['./favorite-product.component.scss']
})
export class FavoriteProductComponent implements OnInit {
  userResponse?: UserResponse | null = null;
  favorites: Favorite[] = [];
  products: Product[] = [];
  isLoading = true;

  constructor(
    public router: Router, // Thay đổi từ private sang public
    private cartService: CartService,
    private userService: UserService,
    private favoriteService: FavoriteService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    this.loadFavorites();
  }

  loadFavorites(): void {
    if (!this.userResponse || !this.userResponse.id) {
      this.isLoading = false;
      return;
    }

    this.favoriteService.getFavoritesByUserId(this.userResponse.id).subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        this.loadFavoriteProducts();
      },
      error: (err) => {
        console.error('Error loading favorites:', err);
        this.isLoading = false;
      },
    });
  }

  loadFavoriteProducts(): void {
    if (this.favorites.length === 0) {
      this.isLoading = false;
      return;
    }

    const productRequests = this.favorites.map((favorite) =>
      this.productService.getDetailProduct(favorite.product_id)
    );

    forkJoin(productRequests).subscribe({
      next: (responses) => {
        this.products = responses.map((response) => ({
          ...response.data,
          url: `${environment.apiBaseUrl}/products/images/${response.data.thumbnail}`,
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product details:', err);
        this.isLoading = false;
      },
    });
  }
}
