export interface Coupon {
  id?: number;                // Mã định danh duy nhất cho khuyến mãi
  code: string;             // Tiêu đề của chương trình khuyến mãi
  active: number;        // Trạng thái hoạt động của khuyến mãi
  value: string;          // Giá trị khuyến mãi
}
