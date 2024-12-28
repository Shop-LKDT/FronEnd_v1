import { Warehouse } from './../models/warehouse';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../responses/api.response';
import { Product } from '../models/product';
import { WarehouseProduct } from '../dtos/product/warehouseProduct';

@Injectable({
  providedIn: 'root'
})
export class WareHouseService {

  private apiUrl = `${environment.apiBaseUrl}/warehouses`;  // URL của API

  constructor(private http: HttpClient) { }

  // Lấy danh sách warehouse
  getAllWarehouses(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl);
  }

  // Tạo warehouse mới
  createWarehouse(wareHouse: Warehouse): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, wareHouse);
  }
  insertWareHouseProduct(warehouseProduct: WarehouseProduct): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/warehouse-products`, warehouseProduct);
  }
  getAllproductNotInWarehouse(warehouseId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiBaseUrl}/warehouse-products/products-not-in-warehouse/${warehouseId}`);
  }

}
