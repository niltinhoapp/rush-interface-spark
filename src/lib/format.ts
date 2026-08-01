export const formatCurrency = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value)
    ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "—";

export const formatNumber = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value) ? value.toLocaleString("pt-BR") : "—";

export const formatPercent = (value: number | null | undefined, digits = 0) =>
  typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(digits)}%` : "—";

export const formatDateTime = (iso: string | null | undefined) => {
  if (!iso || iso === "—") return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (iso: string | null | undefined) => {
  if (!iso || iso === "—") return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("pt-BR");
};

/** Exibe um placeholder consistente quando o backend não fornece o dado. */
export const orNotProvided = (value: string | null | undefined, fallback = "Não informado") =>
  value && value !== "—" ? value : fallback;

export const pluralize = (count: number, one: string, many: string) =>
  `${formatNumber(count)} ${count === 1 ? one : many}`;
