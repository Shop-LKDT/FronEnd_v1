
export interface ApiResponse {
    message: string;
    status: string;
    data: any;
}
// export interface ApiResponse<T = any> {
//   message: string;  // Thông báo từ API
//   status: string;   // Trạng thái (OK, ERROR, ...)
//   data: T;          // Dữ liệu trả về, kiểu generic
// }
