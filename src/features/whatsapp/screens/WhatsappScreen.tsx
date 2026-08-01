import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AsyncSection } from "@/components/common/AsyncSection";
import { Skeleton } from "@/components/ui/skeleton";
import { WhatsappStatusHero } from "@/components/whatsapp/WhatsappStatusHero";
import { WhatsappConnectionDetails } from "@/components/whatsapp/WhatsappConnectionDetails";
import { WhatsappActions } from "@/components/whatsapp/WhatsappActions";
import { WhatsappWarnings } from "@/components/whatsapp/WhatsappWarnings";
import { SendTestMessageModal } from "@/components/whatsapp/SendTestMessageModal";
import { useAction, useTemplates, useWhatsappConnection } from "@/hooks";
import { services } from "@/services";
import type { WhatsappConnection } from "@/types/connections";

export function WhatsappScreen() {
  const { data, loading, initialLoading, error, refetch, setData } = useWhatsappConnection();
  const templates = useTemplates();
  const connect = useAction(services.whatsapp.connect);
  const [testMessageOpen, setTestMessageOpen] = useState(false);

  const approvedTemplates = (templates.data?.whatsapp ?? []).filter((t) => t.approval === "aprovado");

  const handleUpdated = (next: WhatsappConnection) => setData(next);

  return (
    <AppShell title="WhatsApp oficial" subtitle="WhatsApp Cloud API · canal transacional">
      <AsyncSection
        loading={initialLoading}
        error={error}
        onRetry={refetch}
        skeleton={
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        }
      >
        {data && data.status === "nao_conectado" ? (
          <WhatsappStatusHero
            pending={connect.pending}
            onConnect={async () => {
              const result = await connect.run();
              if (result) setData(result);
            }}
          />
        ) : data ? (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              <WhatsappConnectionDetails connection={data} />
            </div>
            <div className="space-y-4">
              <WhatsappWarnings connection={data} />
              <WhatsappActions
                connection={data}
                onUpdated={handleUpdated}
                onOpenTestMessage={() => setTestMessageOpen(true)}
              />
            </div>
          </div>
        ) : null}
      </AsyncSection>

      <SendTestMessageModal
        open={testMessageOpen}
        onOpenChange={setTestMessageOpen}
        approvedTemplates={approvedTemplates}
      />
    </AppShell>
  );
}
