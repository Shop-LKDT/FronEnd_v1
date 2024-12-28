import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category';
import { UpdateCategoryDTO } from '../dtos/category/update.category.dto';
import { InsertCategoryDTO } from '../dtos/category/insert.category.dto';
import { ApiResponse } from '../responses/api.response';
import { Coupon } from '../models/coupon';
export interface CouponResult {
  result: number;
}

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  private apiBaseUrl = `${environment.apiBaseUrl}` + '/coupons';

  constructor(private http: HttpClient) { }
  applyCoupon(couponCode: string, totalAmount: number): Observable<ApiResponse> {
    const url = `${this.apiBaseUrl}/calculate`;
    const params = new HttpParams()
      .set('couponCode', couponCode)
      .set('totalAmount', totalAmount.toString());

    return this.http.get<ApiResponse>(url, { params });
  }
  /**
   * Tạo mới một mã giảm giá
   * @param coupon Dữ liệu mã giảm giá
   * @returns Observable chứa mã giảm giá mới
   */
  createCoupon(coupon: Coupon): Observable<Coupon> {
    return this.http.post<Coupon>(this.apiBaseUrl, coupon);
  }

  /**
   * Lấy danh sách tất cả mã giảm giá
   * @returns Observable danh sách mã giảm giá
   */
  getAllCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${this.apiBaseUrl}`);
  }

  /**
   * Lấy thông tin mã giảm giá theo ID
   * @param id ID của mã giảm giá
   * @returns Observable mã giảm giá
   */
  getCouponById(id: number): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.apiBaseUrl}/${id}`);
  }

  /**
   * Lấy thông tin mã giảm giá theo mã code
   * @param code Mã giảm giá
   * @returns Observable mã giảm giá
   */
  getCouponByCode(code: string): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.apiBaseUrl}/code/${code}`);
  }

  /**
   * Cập nhật mã giảm giá
   * @param id ID của mã giảm giá cần cập nhật
   * @param coupon Dữ liệu mã giảm giá cần cập nhật
   * @returns Observable mã giảm giá đã được cập nhật
   */
  updateCoupon(id: number, coupon: Coupon): Observable<Coupon> {
    return this.http.put<Coupon>(`${this.apiBaseUrl}/${id}`, coupon);
  }

  /**
   * Xóa mã giảm giá theo ID
   * @param id ID của mã giảm giá cần xóa
   * @returns Observable kết quả xóa
   */
  deleteCoupon(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiBaseUrl}/${id}`);
  }

  /**
   * Kiểm tra trạng thái mã giảm giá (hoạt động hoặc hết hạn)
   * @param couponCode Mã giảm giá cần kiểm tra
   * @returns Observable trạng thái mã giảm giá
   */
  checkCouponStatus(couponCode: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiBaseUrl}/status/${couponCode}`);
  }
}
