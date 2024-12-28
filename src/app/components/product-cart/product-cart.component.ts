import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { UserResponse } from '../../responses/user/user.response';
import { UserService } from '../../services/user.service';
import { FavoriteService } from '../../services/favorite.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.scss'
})

export class ProductCartComponent {
  @Input() product:any

  userResponse?: UserResponse | null = null;
  products: Product[] = [];


    constructor( private router:Router,
       private cartService: CartService,
       private userService: UserService,
       private favoriteService: FavoriteService,
       private snackBar: MatSnackBar

    ){}
    navigateTo(path: string) {
      console.log(path);
    
      // Navigate to the desired path
      this.router.navigate([path]).then(() => {
        // Reload the page after navigation is successful
        window.location.reload();
      });
    }
    
  ngOnInit(): void {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();

  }
  HandleLogin(){
    this.router.navigate(['/login']);
  }
  addToCart(product: Product): void {
    this.cartService.addToCart(product.id, 1);
    alert("The product has been added to the cart");
  }
  toggleFavorite(productID: number): void {
    // Kiểm tra nếu userResponse không tồn tại hoặc không có id
    console.log(this.userResponse,"=========52===========");
    if (!this.userResponse || !this.userResponse.id) {
      this.snackBar.open('Please login to add product to favorites!', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.favoriteService.toggleFavorite(this.userResponse.id, productID).subscribe({
      next: (isFavorited) => {
        const message = isFavorited
          ? alert("Product has been added to favorites!")
          : alert("Product has been removed from favorites!");
        // this.snackBar.open(message, 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error toggling favorite:', err);
        alert('An error occurred. Please try again.');
      },
    });
  }
}
