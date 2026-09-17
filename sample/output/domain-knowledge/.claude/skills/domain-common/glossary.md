| 用語 | コード上の名前 | 意味 |
| --- | --- | --- |
| 顧客 | `Customer` | 受注を行う取引先。会員ランク・与信枠・顧客区分を持つ |
| 会員ランク | `Customer.rank` / `CustomerRank` | "NORMAL"、"SILVER"、"GOLD" のいずれか。受注の割引（`domain-order`）と在庫の引当特例（`domain-inventory`）に影響する |
| 引当 | `allocate` / `Stock.allocated` | 受注の明細に対して在庫を確保すること。引当を取り消すことを引当解除（`release`）という |
