import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Mail, PlugZap, Send, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AsyncSection } from "@/components/common/AsyncSection";
import { MetricCard } from "@/components/common/MetricCard";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmailConnectionDetails } from "@/components/email/EmailConnectionDetails";
import { EmailEditForm } from "@/components/email/EmailEditForm";
import { SendTestEmailModal } from "@/components/email/SendTestEmailModal";
import { useAction, useEmailConnection } from "@/hooks";
import { services } from "@/services";
import type { EmailConnection } from "@/types/connections";

export function EmailScreen() {
  const { data, loading, initialLoading, error, refetch, setData } = useEmailConnection();
  const connect = useAction(services.email.connect);
  const test = useAction(services.email.test);
  const [editOpen, setEditOpen] = useState(false);
  const [testEmailOpen, setTestEmailOpen] = useState(false);

  const connection = data?.connection;

  const handleUpdated = (next: EmailConnection) =>
    setData((current) => (current ? { ...current, connection: next } : { connection: next, senders: [] }));

  return (
    <AppShell title="E-mail" subtitle="Remetente verificado e desempenho de entrega">
      <AsyncSection
        loading={initialLoading}
        error={error}
        onRetry={refetch}
        skeleton={
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        }
      >
        {connection ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {connection.stats.map((s) => (
                <MetricCard key={s.label} label={s.label} value={s.value} icon={Mail} />
              ))}
            </div>

            {connection.status === "desconectado" ? (
              <SectionCard bodyClassName="flex flex-col items-center gap-4 p-10 text-center">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Mail className="size-7" />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold">E-mail não conectado</p>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                    Conecte um provedor de envio para habilitar automações por e-mail.
                  </p>
                </div>
                <Button
                  type="button"
                  size="lg"
                  className="min-h-11"
                  disabled={connect.pending}
                  onClick={async () => {
                    const result = await connect.run();
                    if (result) {
                      handleUpdated(result);
                      toast.success("E-mail conectado com sucesso");
                    }
                  }}
                >
                  <PlugZap className="size-4" />
                  {connect.pending ? "Conectando…" : "Conectar e-mail"}
                </Button>
              </SectionCard>
            ) : (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-4">
                  <EmailConnectionDetails connection={connection} onEdit={() => setEditOpen(true)} />
                </div>
                <div className="space-y-4">
                  <SectionCard title="Avisos" bodyClassName="space-y-3">
                    {connection.warnings.length === 0 ? (
                      <div className="flex items-center gap-3 rounded-xl border border-success/25 bg-success/10 p-3 text-success">
                        <ShieldCheck className="size-4 shrink-0" />
                        <p className="text-sm">Nenhum aviso no momento.</p>
                      </div>
                    ) : (
                      connection.warnings.map((w) => (
                        <div
                          key={w}
                          className="flex items-start gap-3 rounded-xl border border-warning/25 bg-warning/10 p-3 text-warning"
                        >
                          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                          <p className="text-sm leading-relaxed">{w}</p>
                        </div>
                      ))
                    )}
                    {connection.error ? (
                      <div className="flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-destructive">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                        <p className="text-sm leading-relaxed">{connection.error}</p>
                      </div>
                    ) : null}
                  </SectionCard>

                  <SectionCard title="Ações" bodyClassName="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-11 w-full justify-start gap-2"
                      disabled={test.pending}
                      onClick={async () => {
                        const result = await test.run();
                        if (result) (result.ok ? toast.success : toast.error)(result.message);
                      }}
                    >
                      <ShieldCheck className="size-4 text-primary" />
                      {test.pending ? "Testando…" : "Testar conexão"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-11 w-full justify-start gap-2"
                      onClick={() => setTestEmailOpen(true)}
                    >
                      <Send className="size-4 text-primary" />
                      Enviar e-mail de teste
                    </Button>
                  </SectionCard>
                </div>
              </div>
            )}

            <EmailEditForm
              open={editOpen}
              connection={connection}
              onOpenChange={setEditOpen}
              onUpdated={handleUpdated}
            />
            <SendTestEmailModal open={testEmailOpen} onOpenChange={setTestEmailOpen} />
          </div>
        ) : null}
      </AsyncSection>
    </AppShell>
  );
}
