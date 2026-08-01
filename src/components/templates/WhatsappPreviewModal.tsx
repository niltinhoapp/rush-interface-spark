import { MessageCircle } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { StatusBadge, statusTones } from "@/components/common/StatusBadge";
import { templateApprovalLabels } from "@/lib/labels";
import type { WhatsappTemplate } from "@/types";

/** Prévia em bolha de conversa, como o contato veria a mensagem no WhatsApp. */
export function WhatsappPreviewModal({
  template,
  onOpenChange,
}: {
  template: WhatsappTemplate | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Modal
      open={Boolean(template)}
      onOpenChange={onOpenChange}
      title={template?.name ?? ""}
      description="Prévia de como o contato recebe esta mensagem"
    >
      {template ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {template.category} · {template.language}
            </p>
            <StatusBadge
              label={templateApprovalLabels[template.approval]}
              tone={statusTones[template.approval] ?? "neutral"}
            />
          </div>

          <div className="rounded-2xl bg-secondary/40 p-4">
            <div className="ml-auto flex max-w-[85%] items-start gap-2">
              <div className="rounded-2xl rounded-tr-sm bg-primary/12 p-3 text-sm leading-relaxed">
                <p className="whitespace-pre-line">{template.content}</p>
                <p className="mt-2 text-right text-[10px] text-muted-foreground">agora</p>
              </div>
              <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <MessageCircle className="size-3.5" />
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">Variáveis do template</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {template.variables.map((v) => (
                <span
                  key={v}
                  className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                >
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
