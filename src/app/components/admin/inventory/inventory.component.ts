import { WarehouseProduct } from './../../../dtos/product/warehouseProduct';
import { WareHouseService } from './../../../services/warehouse.service';
import { Component, NgModule, OnInit } from '@angular/core';
import { Inventory } from '../../../models/inventory';
import { NgFor, NgIf } from '@angular/common';

import { InventoryService } from '../../../services/inventory.service';
import { ApiResponse } from '../../../responses/api.response';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Warehouse } from '../../../models/warehouse';
import { Product } from '../../../models/product';
import { cpSync } from 'fs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [ ReactiveFormsModule,     CommonModule,
      FormsModule,] ,
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  warehouses: any[] = [];
  productNotInWareHouse: any[] = [];
  idToDelete: number | null = null; // Lưu ID của sản phẩm cần xóa
  selectedInventory: any = null;
  inventory: any = {};  // Sản phẩm được chọn để sửa
  inventories: Inventory[] = [];  // Array to hold the warehouse products
  totalinventorys: number = 10;  // Total number of products (this could come from API)
  inventorysPerPage: number = 5;  // Number of products per page
  currentPage: number = 1;  // Current page
  pageSize: number = 6;  // The maximum number of pages
  itemsPerPage: number = 15;
  totalPages: number = Math.ceil(this.totalinventorys / this.inventorysPerPage);  // Total pages
  inventoryForm: FormGroup;
  selectedWarehouse: Warehouse = { id: 0, name: '', location: '', createdAt: [], updatedAt: [] };
  selectedProduct: any;
  selectedQuantity: number = 0;
  keyword:string = "";
  visiblePages: number[] = [];
  localStorage?:Storage;
  warehouseProduct: WarehouseProduct = { warehouseId: 0, productId: 0, quantity: 0 };
  constructor(private inventoryService:InventoryService,
    private warehouseService: WareHouseService
   ) {
    // this.getData(this.currentPage);
    this.inventoryForm = new FormGroup({
      location: new FormControl('', Validators.required),
      isPublished: new FormControl('', Validators.required),
      quantity: new FormControl('', [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit() {
    this.getData(this.keyword, this.currentPage, this.itemsPerPage);  // Fetch data on component initialization
    this.getAllWarehouse();

  }

  // Pagination change handler
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getData(this.keyword, this.currentPage, this.itemsPerPage);  // Fetch data for the selected page
    }
  }
  onPageChange(page: number) {
    debugger;
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentOrderAdminPage', String(this.currentPage));         
    this.getData(this.keyword, this.currentPage, this.itemsPerPage);
  }

  // Method to fetch data for the current page
  getData(keyword: string, page: number, limit: number): void {
    // Assuming that the API method takes the page and pageSize as arguments
    
    this.inventoryService.getAllWarehouseProducts(keyword, page, limit).subscribe(
      (response: ApiResponse) => {
        if (response && response.data) {
          this.inventories = response.data;
            // Assuming 'data' contains the list of products'
            this.totalPages = response.data.length;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
          console.log('Inventory data:', this.inventories);
        } else {
          console.error('No data found for page ' );
        }
      },
      error => {
      }
    );
  }
  getAllWarehouse(): void {
    this.warehouseService.getAllWarehouses().subscribe(
      (response: ApiResponse) => {
        if (response.data) {
          this.warehouses = response.data;  // Assuming 'data' contains the list of warehouses
          console.log('Warehouse data:', this.warehouses);
          // Gọi hàm để lấy sản phẩm cho kho đầu tiên sau khi kho được load
          if (this.warehouses.length > 0) {
            this.getAllProductsNotInWarehouse(this.warehouses[0].id);
          }
        } else {
          console.error('No data found for warehouses');
        }
      },
      error => {
        console.error('Error fetching warehouses', error);
      }
    );
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 8;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);
  
    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
  
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }
  
    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }
  // Lấy tất cả sản phẩm không có trong kho
  getAllProductsNotInWarehouse(warehouseId: number): void {
    console.log('Getting products not in warehouse:', warehouseId);
    this.warehouseService.getAllproductNotInWarehouse(warehouseId).subscribe(
      (response) => {
        if (response) {
          this.productNotInWareHouse = response;  // Giả sử 'data' chứa danh sách sản phẩm
          console.log('Sản phẩm không có trong kho:', this.productNotInWareHouse);
        } else {
          console.error('Không có sản phẩm cho kho', warehouseId);
        }
      },
      error => {
        console.error('Lỗi khi lấy sản phẩm cho kho', warehouseId, error);
      }
    );
  }

  // Gửi dữ liệu khi người dùng nhấn "Thêm"
  onSubmit(event: Event): void {
    event.preventDefault();  // Ngăn không cho form gửi lại
    // ngăn không cho reload trang
    this.insertWareHouseProduct(this.warehouseProduct);  // Gọi hàm để thêm sản phẩm vào kho
    console.log('Form data:', this.warehouseProduct);
  }

  // Thêm sản phẩm vào kho
  insertWareHouseProduct(warehouseProduct: WarehouseProduct): void {
    console.log('Inserting warehouse product:', warehouseProduct);
    this.warehouseService.insertWareHouseProduct(warehouseProduct).subscribe(
      (response: ApiResponse) => {
        console.log('Phản hồi thêm sản phẩm:', response);
        if (response.status === 'CREATED') {
          alert('Sản phẩm đã được thêm thành công');
          this.getAllProductsNotInWarehouse(warehouseProduct.warehouseId); // Làm mới danh sách sản phẩm
          this.getData(this.keyword, this.currentPage, this.itemsPerPage); // Làm mới danh sách kho lưu trữ
          this.warehouseProduct = { warehouseId: 0, productId: 0, quantity: 0 }; // Reset form// Reset form
        } else {
          alert('Thêm sản phẩm thất bại');
        }
      },
      error => {
        console.error('Lỗi khi thêm sản phẩm:', error);
        alert('Có lỗi xảy ra khi thêm sản phẩm.');
      }
    );
  }
  // Sự kiện khi thay đổi kho lưu trữ
  onWarehouseChange(event: any): void {
    const warehouseId = event.target.value;
    if (warehouseId ) {
      this.getAllProductsNotInWarehouse(warehouseId);
      this.warehouseProduct.warehouseId = warehouseId;
    }
    
  }
  onproductChange(event: any): void {
    const productId = event.target.value;
    if (productId) {
      this.warehouseProduct.productId = productId;
    }
    
  }
  onquantityChange(event: any): void {
    const quantity = event.target.value;
    if (quantity) {
      this.warehouseProduct.quantity = quantity;
    }
    
  }

  updateInventory(): void {
    if (this.inventoryForm.valid) {
      const updatedQuantity = this.inventoryForm.get('quantity')?.value; // Lấy số lượng mới từ form
      console.log('Updating inventory with quantity:', updatedQuantity);

      this.inventoryService.updateWarehouseProduct(this.selectedInventory.id, updatedQuantity).subscribe(
        (response: ApiResponse) => {
          console.log('Update response:', response);
          if (response.status === 'OK') {
            alert('Quantity updated successfully');
            this.getData(this.keyword, this.currentPage, this.itemsPerPage); // Refresh danh sách sau khi cập nhật
          } else {
            alert('Failed to update quantity');
          }
        },
        (error) => {
          console.error('Error updating inventory:', error);
          alert('An error occurred while updating the quantity.');
        }
      );
    } else {
      alert('Please enter a valid quantity.');
    }
  }
  openEditModal(inventory: any): void {
    this.selectedInventory = { ...inventory }; // Sao chép thông tin để chỉnh sửa
    console.log('Selected inventory:', this.selectedInventory);
    this.inventoryForm.patchValue({
      quantity: inventory.quantity
    });
  }

  confirmDelete(): void {
    if (this.idToDelete !== null) {
      this.inventoryService.deleteWarehouseProduct(this.idToDelete).subscribe(
        (response: ApiResponse) => {
          console.log('Delete response:', response);
          if (response.status === 'OK') {
            alert('Kho lưu trữ đã được xóa thành công');
            this.getData(this.keyword, this.currentPage, this.itemsPerPage); // Làm mới danh sách sau khi xóa
          } else {
            alert('Không thể xóa kho lưu trữ');
          }

        },
        (error) => {
          console.error('Error deleting inventory:', error);
          alert('Đã xảy ra lỗi khi xóa kho lưu trữ.');

        }
      );
    }
  }
  openDeleteModal(id: number): void {
    this.idToDelete = id; // Lưu lại ID của sản phẩm cần xóa
    const modal = document.getElementById('confirmDeleteModal');
    if (modal) {
      // Mở modal
      (modal as any).style.display = 'block';
    }
  }

}
