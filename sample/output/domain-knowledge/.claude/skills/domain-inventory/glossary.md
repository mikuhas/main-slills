| 用語 | コード上の名前 | 意味 |
| --- | --- | --- |
| 在庫 | `Stock` | SKU ごとの在庫数量の情報。倉庫コード・実在庫・引当済数・安全在庫を持つ |
| SKU | `Stock.sku` / `OrderLine.sku` | 在庫を管理する商品の単位 |
| 倉庫コード | `Stock.warehouseCode` | 在庫がある倉庫を表すコード |
| 実在庫 | `Stock.onHand` | 手元にある在庫数 |
| 引当済数 | `Stock.allocated` | 受注に引き当てられた数 |
| 安全在庫 | `Stock.safetyStock` | 通常の引当では使わずに残しておく数 |
| 引当可能数 | `availableQuantity` | 実在庫 − 引当済数 − 安全在庫 |
| 引当 | | `domain-common` を参照 |
| 会員ランク | | `domain-common` を参照 |
