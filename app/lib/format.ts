export function formatUsd(amount?: number): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
