import { Eye, Pencil } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge, statusTones } from "@/components/common/StatusBadge";
import { templateApprovalLabels } from "@/lib/labels";
import { formatDate } from "@/lib/format";
import type { EmailTemplate } from "@/types";

export function EmailTemplateCard({
  template,
  onView,
  onEdit,
}: {
  template: EmailTemplate;
  onView: () => void;
  onEdit: () => void;
}) {
  return (
    <SectionCard bodyClassName="space-y-4 p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="truncate font-display font-semibold">{template.name}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{template.subject}</p>
        </div>
        <StatusBadge
          label={templateApprovalLabels[template.status]}
          tone={statusTones[template.status] ?? "neutral"}
        />
      </div>

      <p className="line-clamp-3 whitespace-pre-line rounded-xl bg-secondary/40 p-3 text-sm leading-relaxed text-muted-foreground">
        {template.content}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {template.variables.map((v) => (
          <span
            key={v}
            className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
          >
            {`{{${v}}}`}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border pt-3">
        <span className="truncate text-xs text-muted-foreground">
          Atualizado em {formatDate(template.updatedAt)}
        </span>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            aria-label={`Visualizar template ${template.name}`}
            onClick={onView}
            className="flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:size-8"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            aria-label={`Editar template ${template.name}`}
            onClick={onEdit}
            className="flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:size-8"
          >
            <Pencil className="size-4" />
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
