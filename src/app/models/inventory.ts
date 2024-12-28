export interface Inventory {
  id: number;                // ID của sản phẩm trong kho
  productId: number;        // ID của sản phẩm
  productName: string;      // Tên sản phẩm
  quantity: number;         // Số lượng sản phẩm trong kho
  location: string;         // Vị trí lưu trữ trong kho
  warehouse: string;        // Tên kho chứa sản phẩm
}

