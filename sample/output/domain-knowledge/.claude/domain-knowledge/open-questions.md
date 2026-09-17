## 状態
| 状態 | 意味 |
| --- | --- |
| 回答不明 | 質問したが「分からない」「担当者に確認しないと不明」などで回答が得られなかった |
| 未質問 | 質問が必要と判断したが、ユーザーが途中で質問を打ち切ったため、まだ質問していない（次回の更新時に質問する） |

## domain-order
| 状態 | 質問 | 背景 | 決まると更新されるファイル |
| --- | --- | --- | --- |
| 回答不明 | 高額受注が却下された場合、その受注はキャンセルになるか | `docs/order-design.md` の「3. 高額受注の承認」3. に「却下された受注はキャンセルとする」とあるが、コード（`src/order/order.ts` の Order）には `approved` フラグしかなく、却下を扱う実装が無い | domain-order/flows.md, domain-order/rules.md |
| 回答不明 | 未入金受注の自動キャンセルでも、出荷準備以降の受注は対象外にすべきか | `src/order/orderService.ts` の expireUnpaidOrders が状態を確認せず cancelOrder を呼び、cancelOrder は出荷済以降しか拒否しないため、出荷準備中の未入金受注も自動キャンセルされる。キャンセルは出荷準備に入る前までと回答済み | domain-order/rules.md, domain-order/flows.md |
| 回答不明 | 受付状態（未引当）の受注をキャンセルしたときに引当解除処理が実行され、在庫の引当済数が減るのは意図した挙動か | `src/order/orderService.ts` の cancelOrder が状態に関係なく release を呼び、`src/inventory/allocationService.ts` の release が明細の数量分 `allocated` を減らす。承認待ちの受注は引当されないまま受付状態で残る | domain-order/rules.md, domain-inventory/rules.md |
| 回答不明 | 顧客区分「3: 官公庁」は現在存在するか（あわせて確認: 官公庁の未入金受注は自動キャンセルの対象か） | `docs/order-design.md` の「1. 用語」は 1: 個人、2: 法人、3: 官公庁。`src/shared/customer.ts` の Customer.kbn は "1" / "2" のみ。自動キャンセルは設計書では個人のみ対象、`src/order/orderService.ts` の expireUnpaidOrders は法人以外を対象にしている | domain-order/glossary.md, domain-order/rules.md |
| 未質問 | 受注の入金済（`Order.paid`）は、誰が・どの仕組みで更新するか | `src/order/orderService.ts` の placeOrder で `paid: false` として作成されるが、`true` に更新する処理・記述が設計書にもコードにも無い | domain-order/flows.md |
| 未質問 | 受注の状態を出荷準備（3）にするのは、誰が・どの仕組みで行うか | `src/order/order.ts` に `Preparing = 3` があるが、この状態に変更する処理・記述が設計書にもコードにも無い | domain-order/flows.md |
| 未質問 | 受注の状態を出荷済（4）にするのは、誰が・どの仕組みで行うか | `src/order/order.ts` に `Shipped = 4` があるが、この状態に変更する処理・記述が設計書にもコードにも無い | domain-order/flows.md |
| 未質問 | 未入金受注の自動キャンセル処理は、誰が・いつ（どの頻度で）実行するか | `src/order/orderService.ts` の expireUnpaidOrders を呼び出す処理・スケジュールの記述が設計書にもコードにも無い | domain-order/flows.md |
| 未質問 | 承認が必要になる受注合計が 100万円以上である業務上の理由は何か | `src/order/orderService.ts` の `APPROVAL_THRESHOLD = 1_000_000`（金額は回答で確定済み、理由の記述は無い） | domain-order/rules.md |
| 未質問 | 個人顧客の未入金受注を 72時間超で自動キャンセルする業務上の理由は何か | `src/order/orderService.ts` の `PAYMENT_TIMEOUT_HOURS = 72` と `docs/order-design.md` の「5. 未入金受注の自動キャンセル」（理由の記述は無い） | domain-order/rules.md |
| 未質問 | 承認された高額受注の引当バッチを翌朝 6:00 に実行する業務上の理由は何か | `docs/order-design.md` の「3. 高額受注の承認」2.（別リポジトリのバッチで翌朝 6:00 は回答で確定済み、理由の記述は無い） | domain-order/flows.md |

## domain-inventory
| 状態 | 質問 | 背景 | 決まると更新されるファイル |
| --- | --- | --- | --- |
| 回答不明 | 複数明細の受注で途中の明細が在庫不足になったとき、それより前の明細の引当が残るのは意図した挙動か | `src/inventory/allocationService.ts` の allocate は明細ごとに引当済数を保存し、在庫不足で例外を投げるため、前の明細の引当は取り消されない。受注は受付状態のまま残る | domain-inventory/rules.md |
| 未質問 | GOLD 会員の受注だけ安全在庫まで引き当ててよいとする業務上の理由は何か | `src/inventory/allocationService.ts` の allocate のコメント「GOLD 会員は安全在庫まで引き当ててよい」（理由の記述は無い） | domain-inventory/rules.md |
