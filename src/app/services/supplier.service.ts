import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Supplier } from '../models/supplier';

interface ApiResponse<T> {
  message: string;
  status: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = `${environment.apiBaseUrl}/suppliers`;

  constructor(private http: HttpClient) {}

  // 1. Lấy danh sách tất cả các nhà cung cấp
  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<ApiResponse<Supplier[]>>(this.apiUrl).pipe(
      map(response => response.data) // Extract the 'data' field containing the list of suppliers
    );
  }

  // 2. Lấy nhà cung cấp theo ID
  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<ApiResponse<Supplier>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data) // Extract the 'data' field containing the supplier object
    );
  }

  // 3. Tạo mới một nhà cung cấp
  createSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<ApiResponse<Supplier>>(this.apiUrl, supplier).pipe(
      map(response => response.data) // Extract the 'data' field containing the created supplier
    );
  }

  // 4. Cập nhật thông tin nhà cung cấp theo ID
  updateSupplier(id: number, supplier: Supplier): Observable<Supplier> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<ApiResponse<Supplier>>(`${this.apiUrl}/${id}`, supplier, { headers }).pipe(
      map(response => response.data) // Extract the 'data' field containing the updated supplier
    );
  }

  // 5. Xóa nhà cung cấp theo ID
  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data) // Extract the 'data' field, which may be null
    );
  }
}
