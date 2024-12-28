import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../responses/api.response';
import { OrderDTO } from '../dtos/order/order.dto';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders`;
  private apiGetAllOrders = `${environment.apiBaseUrl}/orders/get-orders-by-keyword`;

  // VNPAY API URLs (Updated URLs)
  private vnpayApiUrl = `${environment.apiBaseUrl}/vnpay/payment`; // Updated VNPAY create payment URL
  private vnpayReturnUrl = `${environment.apiBaseUrl}/vnpay/paymentReturn`; // Updated VNPAY payment return URL

  constructor(private http: HttpClient) {}

  placeOrder(orderData: OrderDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, orderData);
  }

  getOrderById(orderId: number): Observable<ApiResponse> {
    const url = `${this.apiUrl}/${orderId}`;
    return this.http.get<ApiResponse>(url);
  }

  getOrdersByUserId(userId: number): Observable<ApiResponse> {
    const url = `${this.apiUrl}/user/${userId}`;
    return this.http.get<ApiResponse>(url);
  }

  getAllOrders(
    keyword: string,
    page: number,
    limit: number
  ): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<ApiResponse>(this.apiGetAllOrders, { params });
  }

  updateOrder(orderId: number, orderData: OrderDTO): Observable<ApiResponse> {
    const url = `${this.apiUrl}/${orderId}`;
    return this.http.put<ApiResponse>(url, orderData);
  }

  deleteOrder(orderId: number): Observable<ApiResponse> {
    const url = `${this.apiUrl}/${orderId}`;
    return this.http.delete<ApiResponse>(url);
  }

  /**
   * Gửi yêu cầu thanh toán đến VNPAY
   * @param amount: Số tiền thanh toán
   * @param orderInfo: Thông tin đơn hàng
   * @param returnUrl: URL trả về sau khi thanh toán
   * @returns Observable<ApiResponse>
   */
  createPayment(
    amount: number,
    orderInfo: string,
    returnUrl: string
  ): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('amount', amount.toString())
      .set('orderInfo', orderInfo)
      .set('returnUrl', returnUrl);

    return this.http.get<ApiResponse>(this.vnpayApiUrl, { params });
  }

  /**
   * Xử lý kết quả trả về từ VNPAY
   * @param request: Yêu cầu HTTP trả về từ VNPAY
   * @returns Observable<ApiResponse>
   */
  paymentReturn(request: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.vnpayReturnUrl, { params: request });
  }

  // Hàm lấy tổng doanh thu
  getTotalRevenue(): Observable<string> {
    return this.http.get<string>(
      `${environment.apiBaseUrl}/orders/total-revenue`
    );
  }

  getMonthlyRevenue(): Observable<number[]> {
    return this.http.get<number[]>(
      `${environment.apiBaseUrl}/orders/monthly-revenue`
    );
  }
}
