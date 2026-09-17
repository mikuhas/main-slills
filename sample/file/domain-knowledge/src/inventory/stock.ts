export interface Stock {
  sku: string;
  warehouseCode: string;
  onHand: number;
  allocated: number;
  safetyStock: number;
}

// 引当可能数 = 実在庫 - 引当済 - 安全在庫
export function availableQuantity(stock: Stock): number {
  return stock.onHand - stock.allocated - stock.safetyStock;
}
