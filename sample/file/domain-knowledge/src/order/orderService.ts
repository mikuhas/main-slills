import { Customer, isCorporate } from "../shared/customer";
import { allocate, release } from "../inventory/allocationService";
import { Order, OrderLine, OrderStatus } from "./order";
import { orderRepository } from "./orderRepository";

const APPROVAL_THRESHOLD = 1_000_000;
const PAYMENT_TIMEOUT_HOURS = 72;

export async function placeOrder(customer: Customer, lines: OrderLine[]): Promise<Order> {
  if (lines.length === 0) throw new Error("明細がありません");

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const discountRate = customer.rank === "GOLD" ? 0.05 : customer.rank === "SILVER" ? 0.02 : 0;
  const total = Math.floor(subtotal * (1 - discountRate));

  const unpaid = await orderRepository.sumUnpaid(customer.id);
  if (unpaid + total > customer.creditLimit) throw new Error("与信枠を超えています");

  const order = await orderRepository.create({
    customerId: customer.id,
    lines,
    status: OrderStatus.Received,
    total,
    paid: false,
    // 高額受注は承認待ちで作成し、承認フラグは管理画面から別途更新される
    approved: total < APPROVAL_THRESHOLD,
    createdAt: new Date(),
  });

  if (order.approved) {
    await allocate(order, customer);
    order.status = OrderStatus.Allocated;
    await orderRepository.save(order);
  }
  return order;
}

export async function cancelOrder(order: Order): Promise<void> {
  if (order.status >= OrderStatus.Shipped) throw new Error("出荷済みの受注はキャンセルできません");
  await release(order);
  order.status = OrderStatus.Cancelled;
  await orderRepository.save(order);
}

export async function expireUnpaidOrders(now: Date, customers: Map<string, Customer>): Promise<void> {
  const orders = await orderRepository.findUnpaid();
  for (const order of orders) {
    const customer = customers.get(order.customerId)!;
    // 法人は請求書払いのため自動キャンセルしない
    if (isCorporate(customer)) continue;
    const elapsedHours = (now.getTime() - order.createdAt.getTime()) / 3_600_000;
    if (elapsedHours > PAYMENT_TIMEOUT_HOURS) await cancelOrder(order);
  }
}
