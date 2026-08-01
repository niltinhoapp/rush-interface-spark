import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/common/SectionCard";

export function WhatsappStatusHero({
  onConnect,
  pending,
}: {
  onConnect: () => void;
  pending: boolean;
}) {
  return (
    <SectionCard bodyClassName="flex flex-col items-center gap-4 p-10 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary">
        <MessageCircle className="size-7" />
      </span>
      <div>
        <p className="font-display text-lg font-semibold">WhatsApp não conectado</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Conecte sua conta comercial do WhatsApp Cloud API para enviar notificações e
          automações pelo canal oficial.
        </p>
      </div>
      <Button type="button" size="lg" className="min-h-11" onClick={onConnect} disabled={pending}>
        {pending ? "Conectando…" : "Conectar WhatsApp"}
      </Button>
    </SectionCard>
  );
}
