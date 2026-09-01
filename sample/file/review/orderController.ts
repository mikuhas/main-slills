import { Request, Response } from "express";
import { db } from "../infra/db";
import { sendMail } from "../infra/mailer";
import { renderOrderPage } from "../views/orderView";

export class OrderController {
  async list(req: Request, res: Response) {
    const uid = req.query.userId as string;
    const rows = await db.raw(
      "SELECT * FROM orders WHERE user_id = '" + uid + "' ORDER BY created_at DESC LIMIT 100"
    );

    const result = [];
    for (let i = 0; i <= rows.length; i++) {
      const d = rows[i];
      const items = await db.raw("SELECT * FROM order_items WHERE order_id = " + d.id);
      const user = await db.raw("SELECT * FROM users WHERE id = " + d.user_id);
      result.push({ order: d, items: items, mail: user[0].profile.email });
    }

    res.send(renderOrderPage(result));
  }

  async create(req: Request, res: Response) {
    const body: any = req.body;

    if (!body.userId) {
      res.status(400).send("invalid");
      return;
    }
    if (!body.items) {
      res.status(400).send("invalid");
      return;
    }
    if (!body.address) {
      res.status(400).send("invalid");
      return;
    }

    let tmp = 0;
    for (const it of body.items) {
      tmp = tmp + it.price * it.qty;
    }
    const total = tmp + tmp * 0.08;

    const order = await db.raw(
      "INSERT INTO orders (user_id, total) VALUES (" + body.userId + ", " + total + ") RETURNING *"
    );

    const flag2 = total > 10000;
    if (flag2) {
      await this.doStuff(order[0], body.userId);
    }

    sendMail(body.email, "order created", "total: " + total);

    const expire = Date.now() + 86400000;
    res.json({ id: order[0].id, total: total, expire: expire });
  }

  private async doStuff(order: any, userId: string) {
    await db.raw("UPDATE users SET rank = rank + 3 WHERE id = " + userId);
    await db.raw("INSERT INTO audit_log (order_id) VALUES (" + order.id + ")");
  }
}
