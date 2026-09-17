export type CustomerRank = "NORMAL" | "SILVER" | "GOLD";

export interface Customer {
  id: string;
  name: string;
  rank: CustomerRank;
  // 与信枠（円）。未払いの受注合計がこれを超えると新規受注できない
  creditLimit: number;
  kbn: "1" | "2";
}

export function isCorporate(customer: Customer): boolean {
  return customer.kbn === "2";
}
