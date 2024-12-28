// src/app/models/ware-product-response.ts

export class WareProductResponse {
    id: number;
    warehouse: string;
    productId: number;
    productName: string;
    quantity: number;
    createdAt: Date | null;
    updatedAt: Date | null;
  
    constructor(
      id: number,
      warehouse: string,
      productId: number,
      productName: string,
      quantity: number,
      createdAt: Date | null = null,
      updatedAt: Date | null = null
    ) {
      this.id = id;
      this.warehouse = warehouse;
      this.productId = productId;
      this.productName = productName;
      this.quantity = quantity;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  
    // Phương thức từ WarehouseProductEntity (tương đương với fromWareHouseProduct ở Java)
    static fromWarehouseProduct(warehouseProduct: any): WareProductResponse {
      return new WareProductResponse(
        warehouseProduct.id,
        warehouseProduct.warehouse,
        warehouseProduct.productId,
        warehouseProduct.productName,
        warehouseProduct.quantity,
        warehouseProduct.created_at,
        warehouseProduct.updated_at
      );
    }
  }
  