import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { CardStatsComponent } from './card-stats/card-stats.component';
import { OrderService } from '../../../services/order.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-header-stats',
  standalone: true,
  imports: [CardStatsComponent, CurrencyPipe],
  templateUrl: './header-stats.component.html',
  styleUrl: './header-stats.component.scss',
})
export class HeaderStatsComponent implements OnInit {
  constructor(
    private userService: UserService,
    private orderService: OrderService,
  ) {}
  totalUsers: number = 0;
  totalOrderPriceStr: String = '0.00';
  totalOrderPrice: number = 0;

  ngOnInit(): void {
    this.fetchUserCount();
    this.loadTotalRevenue();
  }

  fetchUserCount(): void {
    this.userService.countUsers().subscribe({
      next: (count: number) => {
        this.totalUsers = count;
        console.log(`Total users: ${this.totalUsers}`);
      },
      error: (err) => {
        console.error('Error fetching user count:', err);
      },
    });
  }
  loadTotalRevenue(): void {
    this.orderService.getTotalRevenue().subscribe({
      next: (revenue: string) => {
        console.log(`Total revenue: ${revenue}`);
        this.totalOrderPriceStr = revenue; // Gán tổng doanh thu nhận được
        this.totalOrderPrice = parseFloat(revenue); // Chuyển đổi sang kiểu số
      },
      error: (err) => {
        console.error('Error fetching total revenue:', err);
        this.totalOrderPriceStr = '0.00'; // Gán giá trị mặc định nếu lỗi
        this.totalOrderPrice = 0; // Gán giá trị mặc định nếu lỗi
      },
    });
  }
}
