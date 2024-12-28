import { DatePipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { CouponCondition } from '../../../models/coupon-condition';

@Component({
  selector: 'app-promotion-conditions',
  standalone: true,
  imports: [NgFor, DatePipe],
  templateUrl: './promotion-conditions.component.html',
  styleUrl: './promotion-conditions.component.scss'
})
export class PromotionConditionsComponent {
  promotions: CouponCondition[] = []; // Danh sách các khuyến mãi
  currentPage: number = 1;      // Trang hiện tại
  promotionsPerPage: number = 5; // Số lượng khuyến mãi trên mỗi trang
  totalPromotions: number = 50;   // Tổng số khuyến mãi
  totalPages: number = Math.ceil(this.totalPromotions / this.promotionsPerPage); // Tổng số trang

  ngOnInit() {
    this.generateRandomPromotions(this.currentPage); // Tạo danh sách khuyến mãi ngẫu nhiên

  }

  // Tạo danh sách khuyến mãi giả lập
  generateRandomPromotions(page: number) {
    this.promotions = []; // Xóa dữ liệu cũ trước khi tạo mới
    const start = (page - 1) * this.promotionsPerPage; // Vị trí bắt đầu
    const end = start + this.promotionsPerPage; // Vị trí kết thúc

    for (let i = start + 1; i <= end; i++) {
      if (i > this.totalPromotions) break; 
      this.promotions.push({
        id: i,
        coupon_id: i,
        attribute: `Khuyến mãi ${i}`,
        operator: `Khuyến mãi ${i}`,
        value: `Chi tiết khuyến mãi ${i} với mức giảm ${10 * i}%`,
        discountAmount: 167465,
      });
    }

  }


  // Thay đổi trang
  changePage(page: number) {
    if (page >= 1 && page <= Math.ceil(this.totalPromotions / this.promotionsPerPage)) {
      this.currentPage = page; // Cập nhật trang hiện tại
      this.generateRandomPromotions(this.currentPage);
    }
  }
}
