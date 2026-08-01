import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAction } from "@/hooks";
import { services } from "@/services";
import { maskPhone } from "@/lib/mask";
import type { WhatsappTemplate } from "@/types";

export function SendTestMessageModal({
  open,
  onOpenChange,
  approvedTemplates,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approvedTemplates: WhatsappTemplate[];
}) {
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [phone, setPhone] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [language, setLanguage] = useState("pt_BR");
  const [variables, setVariables] = useState("");
  const { run, pending } = useAction(services.whatsapp.sendTestMessage);

  useEffect(() => {
    if (!open) {
      setStep("form");
      setPhone("");
      setTemplateId(approvedTemplates[0]?.id ?? "");
      setVariables("");
    } else {
      setTemplateId(approvedTemplates[0]?.id ?? "");
    }
  }, [open, approvedTemplates]);

  const selectedTemplate = approvedTemplates.find((t) => t.id === templateId) ?? null;

  const handleConfirm = async () => {
    const variablesRecord = variables
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .reduce<Record<string, string>>((acc, item, index) => {
        acc[`var${index + 1}`] = item;
        return acc;
      }, {});
    const result = await run({ phone, templateId, language, variables: variablesRecord });
    if (result?.ok) {
      toast.success("Mensagem de teste enviada", { description: result.message });
      onOpenChange(false);
    } else if (result) {
      toast.error("Não foi possível enviar", { description: result.message });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Enviar mensagem de teste"
      description="Confira os dados antes de disparar — o envio é imediato"
      footer={
        step === "form" ? (
          <>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => setStep("confirm")}
              disabled={!phone.trim() || !templateId}
            >
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
        <div className="space-y-4">
          <div>
            <Label htmlFor="test-phone">Número do destinatário</Label>
            <Input
              id="test-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+55 11 90000-0000"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="test-template">Template aprovado</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger id="test-template" className="mt-1.5">
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {approvedTemplates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {approvedTemplates.length === 0 ? (
              <p className="mt-1.5 text-xs text-warning">
                Nenhum template aprovado disponível para envio.
              </p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="test-language">Idioma</Label>
            <Input id="test-language" value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="test-variables">Variáveis (separadas por vírgula)</Label>
            <Input
              id="test-variables"
              value={variables}
              onChange={(e) => setVariables(e.target.value)}
              placeholder="Maria, PEDIDO123"
              className="mt-1.5"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">Revise antes de confirmar o disparo:</p>
          <dl className="space-y-2 rounded-xl border border-border bg-secondary/40 p-3">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Destinatário</dt>
              <dd className="font-medium">{maskPhone(phone)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Template</dt>
              <dd className="font-medium">{selectedTemplate?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Idioma</dt>
              <dd className="font-medium">{language}</dd>
            </div>
          </dl>
        </div>
      )}
    </Modal>
  );
}
