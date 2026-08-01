import { cn } from "@/lib/utils";

export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  success: "bg-success/15 text-success border-success/25",
  warning: "bg-warning/15 text-warning border-warning/25",
  danger: "bg-destructive/15 text-destructive border-destructive/25",
  info: "bg-primary/12 text-primary border-primary/25",
  neutral: "bg-secondary text-muted-foreground border-border",
};

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        toneClasses[tone],
        className,
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-current" />
      {label}
    </span>
  );
}

/** Mapas de tom por domínio — apenas apresentação. */
export const statusTones: Record<string, BadgeTone> = {
  ativa: "success",
  pausada: "warning",
  rascunho: "neutral",
  erro: "danger",
  conectado: "success",
  desconectado: "neutral",
  atencao: "warning",
  agendada: "info",
  enviada: "info",
  entregue: "success",
  lida: "success",
  falhou: "danger",
  cancelada: "neutral",
  pago: "success",
  pendente: "warning",
  estornado: "warning",
  cancelado: "danger",
  aguardando: "neutral",
  preparando: "info",
  enviado: "info",
  em_transito: "info",
  entregue_envio: "success",
  recuperado: "success",
  em_recuperacao: "info",
  perdido: "danger",
  aceito: "success",
  recusado: "danger",
  aprovado: "success",
  em_analise: "warning",
  reprovado: "danger",
};

export const statusLabels: Record<string, string> = {
  em_transito: "Em trânsito",
  em_recuperacao: "Em recuperação",
  em_analise: "Em análise",
  pos_venda: "Pós-venda",
  atencao: "Atenção",
};

export const humanize = (value: string) => statusLabels[value] ?? value.replace(/_/g, " ");
