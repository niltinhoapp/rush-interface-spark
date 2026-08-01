import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAction } from "@/hooks";
import { services } from "@/services";
import type { EmailConnection } from "@/types/connections";

export function EmailEditForm({
  open,
  connection,
  onOpenChange,
  onUpdated,
}: {
  open: boolean;
  connection: EmailConnection;
  onOpenChange: (open: boolean) => void;
  onUpdated: (next: EmailConnection) => void;
}) {
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [errors, setErrors] = useState<{ senderEmail?: string }>({});
  const { run, pending } = useAction(services.email.update);

  useEffect(() => {
    if (!open) return;
    setSenderName(connection.senderName ?? "");
    setSenderEmail(connection.senderEmail ?? "");
    setReplyTo(connection.replyTo ?? "");
    setErrors({});
  }, [open, connection]);

  const handleSave = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      setErrors({ senderEmail: "Informe um e-mail válido." });
      return;
    }
    setErrors({});
    const result = await run({ senderName, senderEmail, replyTo });
    if (result) {
      onUpdated(result);
      toast.success("Configurações de e-mail atualizadas");
      onOpenChange(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Editar remetente"
      description="Atualize a identidade usada nos envios"
      footer={
        <>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} disabled={pending}>
            {pending ? "Salvando…" : "Salvar"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="sender-name">Nome do remetente</Label>
          <Input id="sender-name" value={senderName} onChange={(e) => setSenderName(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="sender-email">E-mail do remetente</Label>
          <Input
            id="sender-email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            aria-describedby={errors.senderEmail ? "sender-email-error" : undefined}
            className="mt-1.5"
          />
          {errors.senderEmail ? (
            <p id="sender-email-error" role="alert" className="mt-1.5 text-xs text-destructive">
              {errors.senderEmail}
            </p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="reply-to">E-mail de resposta</Label>
          <Input id="reply-to" value={replyTo} onChange={(e) => setReplyTo(e.target.value)} className="mt-1.5" />
        </div>
      </div>
    </Modal>
  );
}
