import { Request, Response } from "express";
import { OrderStatus } from "./order";
import { cancelOrder } from "./orderService";
import { orderRepository } from "./orderRepository";

export async function handleCancel(req: Request, res: Response) {
  const order = await orderRepository.findById(req.params.id);
  if (!order) return res.status(404).send();

  if (order.status >= OrderStatus.Preparing) {
    return res.status(409).json({ message: "出荷準備に入った受注はキャンセルできません" });
  }
  await cancelOrder(order);
  res.status(204).send();
}
