import { DatePipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Coupon } from '../../../models/coupon';
import { CouponService } from '../../../services/coupon.service';
import { ApiResponse } from '../../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [NgFor, DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.scss'
})
export class PromotionComponent implements OnInit{
  selectedCoupon: Coupon | null = null; // Biến lưu mã khuyến mãi được chọn
  couponForm: FormGroup;
  coupons: Coupon[] = [];
  currentPage: number = 1;      // Trang hiện tại
  promotionsPerPage: number = 5; // Số lượng khuyến mãi trên mỗi trang
  totalPromotions: number = 50;   // Tổng số khuyến mãi
  totalPages: number = Math.ceil(this.totalPromotions / this.promotionsPerPage); // Tổng số trang
  constructor(private couponService: CouponService,private fb: FormBuilder) {
    this.couponForm = this.fb.group({
      code: ['', Validators.required],
      value: ['', Validators.required],
      isPublished: [true, Validators.required],
    });
  }
  ngOnInit() {
    this.getAllCoupons();

  }
  addCoupon(): void {
    console.log('Thêm mã khuyến mãi:', this.couponForm.value);
    if (this.couponForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin mã khuyến mãi.');
      return;
    }

    // Lấy dữ liệu từ form
    const newCoupon: Coupon = {
      code: this.couponForm.value.code,
      value: this.couponForm.value.value + '%',
      active: this.couponForm.value.isPublished,
    };

    // Gọi service để thêm mã khuyến mãi
    this.couponService.createCoupon(newCoupon).subscribe({
      next: (response) => {
        console.log('Mã khuyến mãi mới:', response);

        this.couponForm.reset(); // Reset form sau khi thêm thành công
        // tự động đóng modal sau khi thêm thành công

        this.getAllCoupons(); // Lấy lại danh sách mã kh
      },
      error: (err) => {
        console.error('Lỗi khi thêm mã khuyến mãi:', err.message);
        alert('Không thể thêm mã khuyến mãi. Vui lòng thử lại.');
      },
    });
  }

  // Tạo danh sách khuyến mãi giả lập
  getAllCoupons(): void {
    this.couponService.getAllCoupons().subscribe({
      next: (response: Coupon[]) => {
        console.log('Danh sách mã giảm giá:', response);
        this.coupons = response;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Lỗi khi lấy danh sách mã giảm giá:', err.message);
      },
    });
  }




  // Thay đổi trang
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return; // Nếu trang không hợp lệ, không thay đổi
    }
    this.currentPage = page;
    this.getAllCoupons();
  }

  openEditModal(promotion: Coupon): void {
    this.selectedCoupon = promotion; // Lưu mã khuyến mãi được chọn
    this.couponForm.patchValue({
      code: promotion.code,
      value: promotion.value,
      isPublished: promotion.active,
    });

    // Hiển thị modal
    const modal = document.getElementById('editCategoryModal') as any;
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
  }


  closeEditModal(): void {
    this.selectedCoupon = null; // Xóa dữ liệu mã khuyến mãi đang sửa
    const modal = document.getElementById('editCategoryModal') as any;
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
    }
  }

  updateCoupon(): void {
    if (this.couponForm.invalid || !this.selectedCoupon) {
      alert('Vui lòng điền đầy đủ thông tin mã khuyến mãi.');
      return;
    }

    const updatedCoupon: Coupon = {
      id: this.selectedCoupon.id, // ID của mã khuyến mãi cần sửa
      code: this.couponForm.value.code,
      value: this.couponForm.value.value + '%',
      active: this.couponForm.value.isPublished,
    };

    this.couponService.updateCoupon(updatedCoupon.id!, updatedCoupon).subscribe({
      next: (response) => {
        console.log('Mã khuyến mãi đã được cập nhật:', response);
        alert('Cập nhật mã khuyến mãi thành công!');
        this.getAllCoupons(); // Refresh danh sách
        // this.closeEditModal(); // Đóng modal
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật mã khuyến mãi:', err.message);
        alert('Không thể cập nhật mã khuyến mãi. Vui lòng thử lại.');
      },
    });
  }


    openDeleteModal(promotion: Coupon): void {
      this.selectedCoupon = promotion; // Lưu mã khuyến mãi được chọn
      const modal = document.getElementById('confirmDeleteModal') as any;
      if (modal) {
        modal.style.display = 'block';
        modal.classList.add('show');
      }
    }
    closeDeleteModal(): void {
      this.selectedCoupon = null; // Xóa mã khuyến mãi được chọn
      const modal = document.getElementById('confirmDeleteModal') as any;
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
      }
      const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
    }


  deleteCoupon(): void {
    if (!this.selectedCoupon) {
      alert('Không có mã khuyến mãi nào được chọn.');
      return;
    }

    this.couponService.deleteCoupon(this.selectedCoupon.id!).subscribe({
      next: () => {
        // alert('Xóa mã khuyến mãi thành công!');
        this.getAllCoupons(); // Làm mới danh sách mã khuyến mãi
      },
      error: (err) => {
        console.error('Lỗi khi xóa mã khuyến mãi:', err.message);
        alert('Không thể xóa mã khuyến mãi. Vui lòng thử lại.');
      },
    });
  }


}
