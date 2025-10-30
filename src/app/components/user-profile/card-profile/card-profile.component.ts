import { OrderResponse } from './../../../responses/order/order.response';
import { UserResponse } from './../../../responses/user/user.response';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card-profile',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './card-profile.component.html',
  styleUrl: './card-profile.component.scss'
})
export class CardProfileComponent implements OnInit {
  userResponse?: UserResponse | null;
  orderResponses: OrderResponse[] = [];
  orderShipping: OrderResponse[] = [];
  orderDelivered: OrderResponse[] = [];

  constructor(
    private userService: UserService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    if (this.userResponse) {
      this.getOrdersByUserId(this.userResponse.id);
    }
  }

  getOrdersByUserId(userId: number): void {
    this.orderService.getOrdersByUserId(userId).subscribe((response) => {
      this.orderResponses = response.data;
      // Lọc đơn hàng sau khi dữ liệu đã có
      this.orderShipping = this.orderResponses.filter((order) => order.status === 'pending');
      this.orderDelivered = this.orderResponses.filter((order) => order.status === 'delivered');
      
      // Log kết quả để kiểm tra
      console.log('Đơn hàng đang giao:', this.orderShipping);
      console.log('Đơn hàng đã giao:', this.orderDelivered);
    });
  }
}
