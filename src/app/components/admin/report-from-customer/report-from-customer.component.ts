import { Component, OnInit } from '@angular/core';
import { Report } from '../../../models/report';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { ReportService } from '../../../services/report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportDto } from '../../../dtos/report/report.dto';
import { ApiResponse } from '../../../responses/api.response';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
@Component({
  selector: 'app-report-from-customer',
  templateUrl: './report-from-customer.component.html',
  styleUrls: ['./report-from-customer.component.scss'],
  standalone: true,
  
  imports: [
    CommonModule,
    FormsModule, // Cho ngModel
    ReactiveFormsModule, 
  ]
  
})
export class ReportFromCustomerComponent implements OnInit {
  selectedReport: Report | null = null; // Biến lưu mã khuyến mãi được chọn
  reportForm: FormGroup;
  reports: Report[] = [];
  report: Report | null = null;
  reportDto: ReportDto | null=null;

  totalReports: number = 20;
  ReportsPerPage: number = 5;
  currentPage: number = 0;
  pageSize: number = 40;
  totalPages: number = Math.ceil(this.totalReports / this.ReportsPerPage); // Tổng số trang
  constructor(
    private reportService: ReportService,
    private fb: FormBuilder
  ) {
    this.getAllReports(this.currentPage, this.pageSize);
    this.reportForm = this.fb.group({
      responseFromManagement: ['', Validators.required],
      status: ['Chưa xử lý', Validators.required],
    });

  }
  ngOnInit() {
    
    
  }
  openEditModal(report: Report): void {
    this.selectedReport = report; // Lưu báo cáo được chọn
    this.reportForm = this.fb.group({
      userId: [report.userId, Validators.required],
      responseFromManagement: [report.responseFromManagement, Validators.required],
      status: [report.status, Validators.required],
    });
  
    // Cập nhật `reportDto` khi mở modal
    this.reportDto = new ReportDto(report.userId, report.status, report.responseFromManagement);
  
    // Hiển thị modal
    const modal = document.getElementById('editCategoryModal') as any;
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
    console.log('ReportDto khi mở modal:', this.reportDto);
  }
  
  closeEditModal(): void {
    this.selectedReport = null; // Xóa dữ liệu báo cáo đang sửa
    const modal = document.getElementById('editCategoryModal') as any;
    if (modal) {
      modal.style.display = 'none';
      // modal.classList.remove('show');
    }
  }
  
  openDeleteModal(promotion: Report): void {
    this.selectedReport = promotion; // Lưu mã khuyến mãi được chọn
    const modal = document.getElementById('confirmDeleteModal') as any;
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
  }
  getAllReports(page: number, size: number) { 
    this.reportService.getAllReports(page,size).subscribe({
      next: (response: ApiResponse) => {
        this.reports = response.data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  updateReport(): void {
    // Kiểm tra nếu form không hợp lệ
    if (this.reportForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin báo cáo.');
      return;
    }
    if (this.selectedReport?.userId === undefined) {
      alert('User ID không hợp lệ.');
      return;
    }
  
    // Cập nhật `reportDto` từ giá trị trong form
    const formValue = this.reportForm.value;
    this.reportDto = new ReportDto(
      this.selectedReport?.userId, // userId không thay đổi
      formValue.status,  // lấy trạng thái từ form
      formValue.responseFromManagement // lấy phản hồi từ form
    );
  
    console.log('Đang gửi reportDto:', this.reportDto);
  
    // Gọi API để cập nhật báo cáo
    this.reportService.updateReport(this.selectedReport?.id, this.reportDto).subscribe({
      next: (response: ApiResponse) => {
        console.log('Cập nhật báo cáo thành công:', response);
        this.reportForm.reset();  // Reset form sau khi cập nhật thành công
        // this.closeEditModal();    // Đóng modal sau khi cập nhật thành công
        this.getAllReports(0, 100);  // Tải lại danh sách báo cáo
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật báo cáo:', error.message);
        alert('Không thể cập nhật báo cáo. Vui lòng thử lại.');
      }
    });
  }
  

  deleteReport() {
    if (!this.selectedReport) {
      alert('Không có mã khuyến mãi nào được chọn.');
      return;
    }
    this.reportService.deleteReport(this.selectedReport.id).subscribe({
      next: (response) => {
        this.getAllReports(this.currentPage, this.pageSize);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
