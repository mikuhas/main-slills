| 用語 | コード上の名前 | 意味 |
| --- | --- | --- |
| 受注 | `Order` | 顧客からの注文。明細・状態・受注合計・入金済・承認を持つ |
| 受注明細 | `OrderLine` | 受注の1行。SKU・数量・単価を持つ |
| 受注合計 | `Order.total` | 明細の単価×数量の合計に会員ランク割引を適用し、円未満を切り捨てた金額 |
| 受注状態 | `OrderStatus` / `Order.status` | 1: 受付（`Received`）、2: 引当済（`Allocated`）、3: 出荷準備（`Preparing`）、4: 出荷済（`Shipped`）、9: キャンセル（`Cancelled`） |
| 承認 | `Order.approved` | 高額受注に対する承認。`false` は承認待ち |
| 入金済 | `Order.paid` | 受注の代金が入金済みかどうか。登録時は `false` |
| 未入金受注 | `Order.paid === false` | 入金済でない受注 |
| 与信枠 | `Customer.creditLimit` | 顧客ごとに設定する未入金受注の上限額（円） |
| 法人 | `isCorporate(customer)` | 法人顧客。請求書払いの顧客 |
| 会員ランク | | `domain-common` を参照 |
| 引当 | | `domain-common` を参照 |
