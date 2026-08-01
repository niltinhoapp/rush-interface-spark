import { useState } from "react";
import { Laptop, Smartphone } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { cn } from "@/lib/utils";
import type { EmailTemplate } from "@/types";

export function EmailPreviewModal({
  template,
  onOpenChange,
}: {
  template: EmailTemplate | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <Modal
      open={Boolean(template)}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setDevice("desktop");
      }}
      title={template?.name ?? ""}
      description="Prévia do e-mail"
    >
      {template ? (
        <div className="space-y-4">
          <div role="tablist" aria-label="Dispositivo de prévia" className="inline-flex gap-1 rounded-xl border border-border bg-card p-1">
            <button
              type="button"
              role="tab"
              aria-selected={device === "desktop"}
              onClick={() => setDevice("desktop")}
              className={cn(
                "flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors",
                device === "desktop" ? "bg-primary/12 text-primary" : "text-muted-foreground",
              )}
            >
              <Laptop className="size-3.5" /> Desktop
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={device === "mobile"}
              onClick={() => setDevice("mobile")}
              className={cn(
                "flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors",
                device === "mobile" ? "bg-primary/12 text-primary" : "text-muted-foreground",
              )}
            >
              <Smartphone className="size-3.5" /> Mobile
            </button>
          </div>

          <div
            className={cn(
              "mx-auto overflow-hidden rounded-2xl border border-border bg-card",
              device === "mobile" ? "max-w-[320px]" : "max-w-full",
            )}
          >
            <div className="border-b border-border bg-secondary/40 p-3">
              <p className="truncate text-sm font-semibold">{template.subject}</p>
            </div>
            <div className="p-4">
              <p className="whitespace-pre-line text-sm leading-relaxed">{template.content}</p>
            </div>
          </div>

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
        </div>
      ) : null}
    </Modal>
  );
}
