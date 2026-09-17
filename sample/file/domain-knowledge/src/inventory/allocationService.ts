import { Customer } from "../shared/customer";
import { Order } from "../order/order";
import { availableQuantity } from "./stock";
import { stockRepository } from "./stockRepository";

export async function allocate(order: Order, customer: Customer): Promise<void> {
  for (const line of order.lines) {
    const stock = await stockRepository.findBySku(line.sku);
    // GOLD 会員は安全在庫まで引き当ててよい
    const available = customer.rank === "GOLD" ? stock.onHand - stock.allocated : availableQuantity(stock);
    if (available < line.quantity) throw new Error(`在庫不足: ${line.sku}`);
    stock.allocated += line.quantity;
    await stockRepository.save(stock);
  }
}

export async function release(order: Order): Promise<void> {
  for (const line of order.lines) {
    const stock = await stockRepository.findBySku(line.sku);
    stock.allocated -= line.quantity;
    await stockRepository.save(stock);
  }
}
