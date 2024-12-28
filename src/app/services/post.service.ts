import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse, Post, PostDTO, PostImage } from '../models/post';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = `${environment.apiBaseUrl}/posts`; // API URL cho posts
  private authToken: string = this.tokenService.getToken(); // Thay bằng token thật hoặc lấy từ service xác thực

  constructor(private http: HttpClient, private tokenService: TokenService) {console.log('Authorization Token:', this.authToken);
  }



  // 1. Tạo mới một bài đăng
  createPost(postDTO: PostDTO): Observable<ApiResponse<Post>> {
    return this.http.post<ApiResponse<Post>>(this.apiUrl, postDTO, { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`
    }) })
      .pipe(
        catchError(this.handleError)
      );
  }

  // 2. Lấy tất cả các bài đăng có phân trang
  getAllPosts(page: number = 0, size: number = 10): Observable<ApiResponse<Post[]>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<ApiResponse<Post[]>>(this.apiUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authToken}`
      }),
      params
    }).pipe(
      map((response) => {
        response.data.forEach((post: any) => {
          // Chuyển đổi created_at và updated_at từ chuỗi thời gian ISO sang định dạng dd/MM/yyyy
          if (post.created_at) {
            const createdAtDate = new Date(post.created_at);
            post.created_at = createdAtDate.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
          }

          if (post.updated_at) {
            const updatedAtDate = new Date(post.updated_at);
            post.updated_at = updatedAtDate.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
          }
        });
        return response;
      }),
      catchError(this.handleError)
    );
  }


  // 3. Cập nhật một bài đăng theo ID
  updatePost(id: number, postDTO: PostDTO): Observable<ApiResponse<Post>> {
    return this.http.put<ApiResponse<Post>>(`${this.apiUrl}/${id}`, postDTO, { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`
    }) })
      .pipe(
        catchError(this.handleError)
      );
  }

  // 4. Xóa một bài đăng theo ID
  deletePost(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`, { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`
    }) })
      .pipe(
        catchError(this.handleError)
      );
  }

  // 5. Upload hình ảnh cho bài đăng
  // uploadPostImages(postId: number, files: File[]): Observable<ApiResponse<PostImage[]>> {
  //   const formData = new FormData();
  //   files.forEach((file) => formData.append('files', file));
  //   const headers = this.getAuthHeaders().set('enctype', 'multipart/form-data');
  //   return this.http.post<ApiResponse<PostImage[]>>(`${this.apiUrl}/uploads/${postId}`, formData, { headers })
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // 6. Xem một hình ảnh của bài đăng
  // viewImage(imageName: string): Observable<Blob> {
  //   return this.http.get(`${this.apiUrl}/images/${imageName}`, {
  //     headers: this.getAuthHeaders(),
  //     responseType: 'blob'
  //   }).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // Hàm xử lý lỗi
private handleError(error: HttpErrorResponse): Observable<never> {
  let errorMessage = 'An unknown error occurred!';

  if (error.error && typeof error.error === 'object' && 'message' in error.error) {
    // Lỗi từ phía client hoặc network
    errorMessage = `Client-side error: ${error.error.message}`;
  } else {
    // Lỗi từ phía server
    switch (error.status) {
      case 401:
        errorMessage = 'Unauthorized: Please check your authentication credentials.';
        break;
      case 403:
        errorMessage = 'Forbidden: You do not have permission to access this resource.';
        break;
      case 404:
        errorMessage = 'Not Found: The requested resource could not be found.';
        break;
      default:
        errorMessage = `Server error: ${error.message}`;
        break;
    }
  }

  console.error(errorMessage);
  return throwError(errorMessage);
}

}
