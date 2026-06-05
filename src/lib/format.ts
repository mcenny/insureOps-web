import { format, formatDistanceToNowStrict, isValid } from "date-fns";

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return CURRENCY.format(amount);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(value: string | Date | undefined, pattern = "MMM d, yyyy") {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  if (!isValid(d)) return "-";
  return format(d, pattern);
}

export function formatDateTime(value: string | Date | undefined) {
  return formatDate(value, "MMM d, yyyy 'at' h:mm a");
}

export function formatRelative(value: string | Date | undefined) {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  if (!isValid(d)) return "-";
  return `${formatDistanceToNowStrict(d)} ago`;
}

export function titleCase(value: string) {
  return value
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
