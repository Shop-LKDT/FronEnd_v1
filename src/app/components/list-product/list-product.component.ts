import { Component, OnInit, Inject, CUSTOM_ELEMENTS_SCHEMA, HostListener, Input } from '@angular/core';
import { Category } from './../../models/category';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { TokenService } from '../../services/token.service';
import { ApiResponse } from '../../responses/api.response';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service'; // Đường dẫn đúng đến FavoriteService
import { CartService } from '../../services/cart.service';
import { UserResponse } from '../../responses/user/user.response';
import { UserService } from '../../services/user.service';
import { ProductCartComponent } from '../product-cart/product-cart.component';

@Component({
  selector: 'app-list-product',
  standalone: true,
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss',], // Sửa thành `styleUrls` cho đúng cú pháp
  imports: [
    CommonModule,
    FormsModule,
    ProductCartComponent,
    RouterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListProductComponent implements OnInit {
  @Input() categoryId: any;
  isPressedAddToCart: boolean = false;
  products: Product[] = [];
  activeNavItem: number = 0;
  categories: Category[] = [];
  selectedCategoryId: number = 0;
  currentPage: number = 0;
  itemsPerPage: number = 100;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  localStorage?: Storage;
  apiBaseUrl = environment.apiBaseUrl;
  userResponse?:UserResponse | null;

  // Biến `isFavorited` để lưu trạng thái yêu thích của mỗi sản phẩm
  isFavorited: { [key: number]: boolean } = {};

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private tokenService: TokenService,
    private cartService: CartService,
    private favoriteService: FavoriteService, // Thêm FavoriteService vào constructor
    private userService: UserService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  ngOnInit() {
    this.currentPage = 0;
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.getCategories(0, 100);
    console.log(this.userResponse)
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.categories = apiResponse.data;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product.id, 1);
    alert("The product has been added to the cart");
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    const userId = this.userResponse?.id;
    console.log("================"+ userId);
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (apiresponse: ApiResponse) => {
        const response = apiresponse.data;
        response.products.forEach((product: Product) => {
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          // this.checkFavoriteStatus(product.id); // Kiểm tra trạng thái yêu thích của mỗi sản phẩm
        });
        this.products = response.products;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      }
    });
  }

  // Kiểm tra trạng thái yêu thích của sản phẩm
  checkFavoriteStatus(productId: number) {
    const userId = this.userResponse?.id;
    console.log("================"+ userId);
    if (userId) {
      this.favoriteService.checkFavorite(userId, productId).subscribe({
        next: (response) => {
          console.log("response.favorited============="+ response.favorited);
          this.isFavorited[productId] = response.favorited;
        },
        error: (error: any) => { // hoặc HttpErrorResponse nếu muốn chi tiết hơn
          console.error('Lỗi khi kiểm tra trạng thái yêu thích:', error);
        }
      });
    } else {
      console.error('Không lấy được ID người dùng.');
    }
  }


  // Toggle trạng thái yêu thích cho sản phẩm
  toggleFavorite(productId: number) {
    console.log("===============================")
    this.favoriteService.toggleFavorite(this.tokenService.getUserId(), productId).subscribe({
      next: () => {
        this.isFavorited[productId] = !this.isFavorited[productId];
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật yêu thích:', error);
      }
    });
  }

  setActiveNavItem(index: number) {
    this.activeNavItem = index;
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }

  // Điều hướng đến trang chi tiết sản phẩm
  onProductClick(productId: number) {
    this.router.navigate(['/products', productId]).then(() => {
      window.location.reload();
    });
  }

  slidesPerView: number = 5;
  screenWidth!: number;

  @HostListener('window:resize')
  getScreenWidth() {
    this.screenWidth = window.innerWidth;
    this.slidesPerView = this.screenWidth < 768 ? 1 : 4;
  }
}
