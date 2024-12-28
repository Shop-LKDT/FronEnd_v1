import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiResponse } from '../responses/api.response';
import { Observable } from 'rxjs';
import { ReportDto } from '../dtos/report/report.dto';
import { TokenService } from './token.service';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  token: string = '';
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient,
    private tokenService:TokenService,

  ) {
    this.token = this.tokenService.getToken();
  }
  getAllReports(page: number, size: number): Observable<ApiResponse> {
    console.log('token', this.token);
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/reports?page=${page}&limit=${size}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
        })
      }
    );
  }
  getReport(reportId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/reports/${reportId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
        })
      }
    );
  }
  deleteReport(reportId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiBaseUrl}/reports/${reportId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
        })
      }
    );
  }
  updateReport(reportId: number, report: ReportDto): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/reports/${reportId}`, report,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
        })
      }
    );
  }
  insertReport(report: ReportDto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/reports`, report,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
        })
      }
    );
  }
}
