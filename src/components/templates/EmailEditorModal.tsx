import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EmailTemplate } from "@/types";

/**
 * Editor estruturado (sem drag-and-drop): campos simples para nome, assunto,
 * remetente, corpo e variáveis. Ação visual — não há contrato de persistência
 * de templates de e-mail, então apenas confirma com toast.
 */
export function EmailEditorModal({
  open,
  template,
  defaultSender,
  onOpenChange,
}: {
  open: boolean;
  template: EmailTemplate | null;
  defaultSender: string;
  onOpenChange: (open: boolean) => void;
}) {
  const formId = useId();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [sender, setSender] = useState(defaultSender);
  const [content, setContent] = useState("");
  const [variables, setVariables] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(template?.name ?? "");
    setSubject(template?.subject ?? "");
    setSender(defaultSender);
    setContent(template?.content ?? "");
    setVariables(template?.variables.join(", ") ?? "");
  }, [open, template, defaultSender]);

  const handleSave = () => {
    if (!name.trim() || !subject.trim()) {
      toast.error("Preencha nome e assunto do template.");
      return;
    }
    toast.success(template ? "Template atualizado" : "Template criado", {
      description: "Alteração apenas de demonstração — sem envio ao servidor.",
    });
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={template ? `Editar ${template.name}` : "Novo template de e-mail"}
      description="Campos estruturados — sem editor de arrastar e soltar"
      footer={
        <>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Salvar
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()} id={formId}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="tpl-name">Nome do template</Label>
            <Input id="tpl-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="tpl-subject">Assunto</Label>
            <Input
              id="tpl-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="tpl-sender">Remetente</Label>
          <Input id="tpl-sender" value={sender} onChange={(e) => setSender(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="tpl-body">Corpo do e-mail</Label>
          <Textarea
            id="tpl-body"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="tpl-vars">Variáveis (separadas por vírgula)</Label>
          <Input
            id="tpl-vars"
            value={variables}
            onChange={(e) => setVariables(e.target.value)}
            placeholder="nome, cupom, prazo"
            className="mt-1.5"
          />
        </div>
      </form>
    </Modal>
  );
}
