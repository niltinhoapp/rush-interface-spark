import { MessageCircle, PlugZap, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks";
import { services } from "@/services";
import type { WhatsappConnection } from "@/types/connections";

export function WhatsappActions({
  connection,
  onUpdated,
  onOpenTestMessage,
}: {
  connection: WhatsappConnection;
  onUpdated: (next: WhatsappConnection) => void;
  onOpenTestMessage: () => void;
}) {
  const connect = useAction(services.whatsapp.connect);
  const reconnect = useAction(services.whatsapp.reconnect);
  const refresh = useAction(services.whatsapp.refresh);
  const test = useAction(services.whatsapp.test);

  const isConnected = connection.status === "conectado" || connection.status === "atencao";
  const anyPending = connect.pending || reconnect.pending || refresh.pending || test.pending;

  return (
    <SectionCard title="Ações" bodyClassName="space-y-2">
      {!isConnected && connection.status !== "conectando" ? (
        <Button
          type="button"
          className="min-h-11 w-full justify-start gap-2"
          variant="outline"
          disabled={anyPending}
          onClick={async () => {
            const result = await connect.run();
            if (result) {
              onUpdated(result);
              toast.success("WhatsApp conectado com sucesso");
            }
          }}
        >
          <PlugZap className="size-4 text-primary" />
          {connect.pending ? "Conectando…" : "Conectar"}
        </Button>
      ) : null}

      {connection.status === "erro" || connection.status === "atencao" ? (
        <Button
          type="button"
          className="min-h-11 w-full justify-start gap-2"
          variant="outline"
          disabled={anyPending}
          onClick={async () => {
            const result = await reconnect.run();
            if (result) {
              onUpdated(result);
              toast.success("Reconectado com sucesso");
            }
          }}
        >
          <RefreshCw className="size-4 text-primary" />
          {reconnect.pending ? "Reconectando…" : "Reconectar"}
        </Button>
      ) : null}

      <Button
        type="button"
        className="min-h-11 w-full justify-start gap-2"
        variant="outline"
        disabled={anyPending || !isConnected}
        onClick={async () => {
          const result = await test.run();
          if (result) {
            (result.ok ? toast.success : toast.error)(result.message);
          }
        }}
      >
        <ShieldCheck className="size-4 text-primary" />
        {test.pending ? "Testando…" : "Testar conexão"}
      </Button>

      <Button
        type="button"
        className="min-h-11 w-full justify-start gap-2"
        variant="outline"
        disabled={anyPending || !isConnected}
        onClick={onOpenTestMessage}
      >
        <MessageCircle className="size-4 text-primary" />
        Enviar mensagem de teste
      </Button>

      <Button
        type="button"
        className="min-h-11 w-full justify-start gap-2"
        variant="outline"
        disabled={anyPending}
        onClick={async () => {
          const result = await refresh.run();
          if (result) {
            onUpdated(result);
            toast("Status atualizado");
          }
        }}
      >
        <RefreshCw className="size-4 text-primary" />
        {refresh.pending ? "Atualizando…" : "Atualizar status"}
      </Button>
    </SectionCard>
  );
}
