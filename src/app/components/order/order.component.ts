import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiResponse } from '../../responses/api.response';
import { OrderDTO } from '../../dtos/order/order.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CouponService } from '../../services/coupon.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { TokenService } from '../../services/token.service';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/product';
import { Order } from '../../models/order';
import { ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup;
  cartItems: { product: Product; quantity: number }[] = [];
  totalAmount: number = 0;
  couponDiscount: number = 0;
  couponApplied: boolean = false;
  cart: Map<number, number> = new Map();
  orderData: OrderDTO = {
    order_id: 0,
    user_id: 0,
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    status: 'pending',
    note: '',
    total_money: 0,
    payment_method: 'cod',
    shipping_method: 'express',
    coupon_code: '',
    cart_items: [],
  };

  constructor(
    private couponService: CouponService,
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.email]],
      phone_number: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      note: [''],
      couponCode: [''],
      shipping_method: ['express'],
      payment_method: ['cod'],
    });
  }

  ngOnInit(): void {
    this.orderData.user_id = this.tokenService.getUserId();
    this.cart = this.cartService.getCart();
    const productIds = Array.from(this.cart.keys());

    if (productIds.length === 0) {
      return;
    }

    this.productService.getProductsByIds(productIds).subscribe({
      next: (apiResponse: ApiResponse) => {
        const products: Product[] = apiResponse.data;
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: this.cart.get(productId)!,
          };
        });
      },
      complete: () => {
        this.calculateTotal();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      },
    });

    // Check if the URL has query parameters from VNPay
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['vnp_Amount']) {
        this.handleVNPayReturn(params);
      }
    });
  }

  placeOrder() {
    if (this.orderForm.valid) {
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value,
      };
      this.orderData.cart_items = this.cartItems.map((cartItem) => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity,
      }));
      this.orderData.total_money = this.totalAmount;

      // Nếu phương thức thanh toán là vnpay
      if (this.orderData.payment_method === 'vnpay') {
        // Lấy thông tin khách hàng từ localStorage nếu thanh toán qua VNPay
        this.loadCustomerInfoFromStorage();

        // Kiểm tra nếu có phản hồi từ VNPay (tránh gọi createVNPayPayment khi đã nhận phản hồi từ VNPay)
        const isVNPayReturn =
          this.router.url.includes('orders') &&
          window.location.search.includes('vnp_Amount');
        if (!isVNPayReturn) {
          this.createVNPayPayment();
        }
      } else {
        // Nếu phương thức thanh toán không phải vnpay, gọi API để tạo đơn hàng bình thường
        this.orderService.placeOrder(this.orderData).subscribe({
          next: (response: ApiResponse) => {
            alert('Order placed successfully.');
            this.cartService.clearCart();
            this.saveProductsToLocalStorage();
            this.router.navigate(['/']);
          },
          error: (error: HttpErrorResponse) => {
            console.error(
              `Error placing order: ${error?.error?.message ?? ''}`
            );
          },
        });
      }
    } else {
      console.error('Invalid form data. Please check and try again.');
    }
  }

  // Handle VNPay payment creation
  createVNPayPayment() {
    // Lưu thông tin khách hàng trước khi chuyển đến VNPay
    this.saveCustomerInfoToStorage();

    const randomOrderNumber = Math.floor(10000000 + Math.random() * 90000000);
    const orderInfo = `ORD${randomOrderNumber}`;
    const returnUrl = `http://localhost:4200`;

    this.orderService
      .createPayment(this.totalAmount, orderInfo, returnUrl)
      .subscribe({
        next: (response: ApiResponse) => {
          if (response.data) {
            window.location.href = response.data;
          } else {
            console.error('Payment URL not returned by VNPay.');
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error(
            'Error creating VNPay payment:',
            error?.error?.message ?? ''
          );
        },
      });
  }

  handleVNPayReturn(params: any) {
    const request = { ...params };
    this.orderService.paymentReturn(request).subscribe({
      next: (response: ApiResponse) => {
        if (response.status === 'OK') {
          // Lấy thông tin khách hàng từ localStorage khi thanh toán thành công
          this.loadCustomerInfoFromStorage();

          // Đặt phương thức thanh toán là vnpay và tiến hành đặt hàng
          this.orderData.payment_method = 'vnpay';
          this.orderService.placeOrder(this.orderData).subscribe({
            next: (response: ApiResponse) => {
              alert('Order placed successfully.');
              this.cartService.clearCart();
              this.saveProductsToLocalStorage();
              this.router.navigate(['/']);
            },
            error: (error: HttpErrorResponse) => {
              console.error(
                `Error placing order: ${error?.error?.message ?? ''}`
              );
            },
          });
        } else {
          alert('Payment failed or invalid.');
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(
          `Error processing VNPay return: ${error?.error?.message ?? ''}`
        );
      },
    });
  }

  saveCustomerInfoToStorage() {
    // Lấy thông tin từ form
    const customerInfo = this.orderForm.value;

    // Thêm total_money và cart_items vào customerInfo
    const orderInfoToSave = {
      ...customerInfo,
      total_money: this.totalAmount, // Gán tổng tiền
      cart_items: this.cartItems.map((cartItem) => ({
        product_id: cartItem.product.id, // ID sản phẩm
        quantity: cartItem.quantity, // Số lượng
      })),
    };

    // Lưu thông tin vào localStorage
    localStorage.setItem('customerInfo', JSON.stringify(orderInfoToSave));
  }

  loadCustomerInfoFromStorage() {
    const savedCustomerInfo = localStorage.getItem('customerInfo');
    if (savedCustomerInfo) {
      const customerInfo = JSON.parse(savedCustomerInfo);
      this.orderData = {
        ...this.orderData,
        fullname: customerInfo.fullname,
        email: customerInfo.email,
        phone_number: customerInfo.phone_number,
        address: customerInfo.address,
        note: customerInfo.note,
        coupon_code: customerInfo.couponCode,
        shipping_method: customerInfo.shipping_method,
        payment_method: customerInfo.payment_method,
        total_money: customerInfo.total_money,
        cart_items: customerInfo.cart_items,
      };
    }
  }

  clearCustomerInfoFromStorage() {
    localStorage.removeItem('customerInfo'); // Xóa thông tin khách hàng khỏi localStorage
  }

  // lưu dữ liệu vào local storage
  saveProductsToLocalStorage() {
    const existingOrders = JSON.parse(
      localStorage.getItem('orderedProducts') || '[]'
    );
    const productsToSave = this.orderData;

    const allOrders = [...existingOrders, productsToSave];
    localStorage.setItem('orderedProducts', JSON.stringify(allOrders));
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      this.calculateTotal();
    }
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
    // Cập nhật lại this.cart từ this.cartItems
    this.updateCartFromCartItems();
    this.calculateTotal();
  }

  // Hàm tính tổng tiền
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
  confirmDelete(index: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      // Xóa sản phẩm khỏi danh sách cartItems
      this.cartItems.splice(index, 1);
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      // Tính toán lại tổng tiền
      this.calculateTotal();
    }
  }

  // Hàm xử lý việc áp dụng mã giảm giá
  applyCoupon(): void {
    const couponCode = this.orderForm.get('couponCode')!.value;
    console.log('Mã giảm giá:', couponCode);
    if (!couponCode) {
      return;
    }
    this.calculateTotal();
    this.couponService.applyCoupon(couponCode, this.totalAmount).subscribe({
      next: (response) => {
        console.log('Kết quả giảm giá:', response.data.result);
        this.couponDiscount = response.data.result; // Truy cập đúng cấu trúc response
        this.totalAmount -= this.couponDiscount; // Cập nhật tổng tiền sau giảm giá
        this.couponApplied = true; // Đánh dấu mã giảm giá đã được áp dụng
        this.orderData.coupon_code = couponCode; // Lưu mã giảm giá vào dữ liệu đơn hàng
      },
      error: (error) => {
        console.error('Lỗi khi áp dụng mã giảm giá:', error);
        alert('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
      },
    });
  }

  private updateCartFromCartItems(): void {
    this.cart.clear();
    this.cartItems.forEach((item) => {
      this.cart.set(item.product.id, item.quantity);
    });
    this.cartService.setCart(this.cart);
  }
}
