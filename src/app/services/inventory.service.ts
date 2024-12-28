import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../responses/api.response';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private apiUrl = `${environment.apiBaseUrl}/warehouse-products`; // Set your base API URL

  constructor(private http: HttpClient) { }

  // Get all products in the warehouse
  getAllWarehouseProducts(keyword: string,
    page: number,
    limit: number): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<ApiResponse>(this.apiUrl, { params });
  }

  // Get a product by ID
  getWarehouseProductById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`);
  }



  // Update a product in the warehouse by ID
  updateWarehouseProduct(id: number, quantity: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}?quantity=${quantity}`, {});
  }

  // Update the quantity of a product
  updateProductQuantity(id: number, quantity: number): Observable<ApiResponse> {
    const params = new HttpParams().set('quantity', quantity.toString());
    console.log('params:', quantity);
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}?quantity`, {}, { params });
  }

  // Delete a product from the warehouse
  deleteWarehouseProduct(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  // Check the available quantity of a product
  getAvailableQuantity(productId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${productId}/quantity`);
  }
}
