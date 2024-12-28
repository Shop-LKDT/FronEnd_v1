export interface CouponCondition {
  id: number;                // Mã định danh duy nhất cho khuyến mãi
  coupon_id: number;             // Tiêu đề của chương trình khuyến mãi
  attribute: string;
  operator: string;
  value: string;
  discountAmount: number;        // Giá khuyến mãi
}
