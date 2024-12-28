import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../../models/supplier';
import { DatePipe, NgFor } from '@angular/common';
import { SupplierService } from '../../../services/supplier.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [NgFor,DatePipe, ReactiveFormsModule],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss'
})
export class SupplierComponent implements OnInit{
  suppliers: Supplier[] = []; // Mảng lưu trữ các nhà cung cấp
  addSupplierForm: FormGroup;
  editSupplierForm: FormGroup;
  selectedSupplier: Supplier | null = null;
  totalsuppliers: number = 50;
  suppliersPerPage: number = 5;
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = Math.ceil(this.totalsuppliers / this.suppliersPerPage); // Tổng số trang
  constructor(private supplierService: SupplierService, private fb: FormBuilder) {
    this.addSupplierForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: [''],
      email: ['', [Validators.required, Validators.email]]
    });
    this.editSupplierForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: [''],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  ngOnInit() {
    this.loadSuppliers();
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadSuppliers();
    }
  }
  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (response) => {
        this.suppliers = response;
        console.log('Danh sách nhà cung cấp:', this.suppliers);
      },
      error: (err:any) => {
        console.error('Error loading suppliers', err);
      }
    });
  }
  addSupplier(): void {
    if (this.addSupplierForm.valid) {
      const newSupplier: Supplier = this.addSupplierForm.value;
      console.log('Thêm nhà cung cấp:', newSupplier);
      this.supplierService.createSupplier(newSupplier).subscribe({
        next: (supplier) => {
          this.suppliers.push(supplier); // Thêm nhà cung cấp mới vào danh sách
          this.addSupplierForm.reset(); // Reset form sau khi thêm thành công
          alert('Thêm nhà cung cấp thành công!');
          this.loadSuppliers(); // Cập nhật lại danh sách nhà cung cấp
        },
        error: (err) => {
          console.error('Lỗi khi thêm nhà cung cấp:', err);
          alert('Không thể thêm nhà cung cấp');
        }
      });
    } else {
      alert('Vui lòng điền đầy đủ thông tin nhà cung cấp');
    }
  }
  openEditModal(supplier: Supplier): void {
    this.selectedSupplier = supplier;
    this.editSupplierForm.patchValue({
      name: supplier.name,
      address: supplier.address,
      email: supplier.email,
      phone: supplier.phone
    });
  }


  updateSupplier(): void {
    if (this.editSupplierForm.valid && this.selectedSupplier) {
      const updatedSupplier: Supplier = {
        ...this.selectedSupplier,
        ...this.editSupplierForm.value,
      };

      if (!updatedSupplier.id) {
        alert('Nhà cung cấp không tồn tại');
        return;
      }
      this.supplierService.updateSupplier(updatedSupplier.id, updatedSupplier).subscribe({
        next: () => {
          this.loadSuppliers();
          alert('Cập nhật nhà cung cấp thành công!');
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật nhà cung cấp:', err);
          alert('Không thể cập nhật nhà cung cấp');
        }
      });
    }
  }


  deleteSupplier(id: number): void {
    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.suppliers = this.suppliers.filter(supplier => supplier.id !== id);
        alert('Nhà cung cấp đã được xóa thành công!');
      },
      error: (err) => {
        console.error('Lỗi khi xóa nhà cung cấp:', err);
        alert('Không thể xóa nhà cung cấp');
      }
    });
  }


}

  // generateRandomsuppliers(page: number) {
  //   this.suppliers = []; // Xóa dữ liệu cũ trước khi tạo mới
  //   const start = (page - 1) * this.suppliersPerPage; // Vị trí bắt đầu
  //   const end = start + this.suppliersPerPage; // Vị trí kết thúc

  //   for (let i = start + 1; i <= end; i++) {
  //     if (i > this.totalsuppliers) break; // Dừng lại nếu vượt quá tổng số người dùng

  //     this.suppliers.push({
  //       id: i,
  //       name: `Nhà cung cấp ${i}`,
  //       phone: `0123${Math.floor(Math.random() * 900000) + 100000}`, // Số điện thoại ngẫu nhiên
  //       address: `Địa chỉ nhà cung cấp ${i}`,
  //       email: `email${i}@.email.com`,
  //     });
  //   }
  // }

