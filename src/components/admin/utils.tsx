import { Badge } from "@/components/ui/badge";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-MZ", { style: "currency", currency: "MZN" }).format(value);

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });

export const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("pt-PT", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    confirmed: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    processing: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
    shipped: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300",
    delivered: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    cancelled: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    refunded: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 dark:bg-gray-800"}`}>{status}</span>;
};

export function downloadCSV(data: Record<string, unknown>[], columns: string[], filename: string) {
  if (data.length === 0) return;
  const headers = columns.join(",");
  const rows = data.map(row => columns.map(col => {
    const val = row[col] ?? "";
    return `"${String(val).replace(/"/g, '""')}"`;
  }).join(",")).join("\n");
  const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
