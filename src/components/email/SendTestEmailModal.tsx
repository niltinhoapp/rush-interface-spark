import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAction } from "@/hooks";
import { services } from "@/services";

export function SendTestEmailModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [to, setTo] = useState("");
  const { run, pending } = useAction(services.email.sendTestEmail);

  useEffect(() => {
    if (!open) {
      setStep("form");
      setTo("");
    }
  }, [open]);

  const handleConfirm = async () => {
    const result = await run({ to });
    if (result?.ok) {
      toast.success("E-mail de teste enviado", { description: result.message });
      onOpenChange(false);
    } else if (result) {
      toast.error("Não foi possível enviar", { description: result.message });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Enviar e-mail de teste"
      description="Confirme o destinatário antes de enviar"
      footer={
        step === "form" ? (
          <>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={() => setStep("confirm")} disabled={!to.trim()}>
              Continuar
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="outline" onClick={() => setStep("form")} disabled={pending}>
              Voltar
            </Button>
            <Button type="button" onClick={handleConfirm} disabled={pending}>
              {pending ? "Enviando…" : "Confirmar envio"}
            </Button>
          </>
        )
      }
    >
      {step === "form" ? (
        <div>
          <Label htmlFor="test-email-to">E-mail do destinatário</Label>
          <Input
            id="test-email-to"
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="voce@exemplo.com"
            className="mt-1.5"
          />
        </div>
      ) : (
        <p className="text-sm">
          Um e-mail de teste será enviado para <strong>{to}</strong>. Deseja continuar?
        </p>
      )}
    </Modal>
  );
}
