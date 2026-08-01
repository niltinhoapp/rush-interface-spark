import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PeriodSelector } from "@/components/common/PeriodSelector";
import { ErrorState } from "@/components/common/ErrorState";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { MessagesChart } from "@/components/dashboard/MessagesChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ChannelSummaryList } from "@/components/dashboard/ChannelSummaryList";
import { ExecutionsList } from "@/components/dashboard/ExecutionsList";
import { AttentionList } from "@/components/dashboard/AttentionList";
import { ChannelHealthCards } from "@/components/dashboard/ChannelHealthCards";
import { useDashboard, useEmailConnection, useWhatsappConnection } from "@/hooks";
import { periodLabels } from "@/lib/labels";
import type { PeriodFilter } from "@/types/filters";

export function DashboardScreen() {
  const [period, setPeriod] = useState<PeriodFilter>({ preset: "30d" });
  const dashboard = useDashboard(period);
  const whatsapp = useWhatsappConnection();
  const email = useEmailConnection();

  const metrics = dashboard.data;

  const channels = [
    { name: "WhatsApp", connected: whatsapp.data?.status === "conectado" },
    { name: "E-mail", connected: email.data?.connection.status === "conectado" },
  ];

  return (
    <AppShell
      title="Visão geral"
      subtitle={periodLabels[period.preset]}
      channels={channels}
      actions={<PeriodSelector value={period} onChange={setPeriod} />}
    >
      {dashboard.error ? (
        <ErrorState description={dashboard.error} onRetry={dashboard.refetch} />
      ) : (
        <>
          <MetricsGrid metrics={metrics} loading={dashboard.initialLoading} />

          <div className="mt-6">
            <ChannelHealthCards
              whatsapp={whatsapp.data ?? null}
              whatsappLoading={whatsapp.initialLoading}
              whatsappError={whatsapp.error}
              email={email.data?.connection ?? null}
              emailLoading={email.initialLoading}
              emailError={email.error}
            />
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <MessagesChart
              data={metrics?.messagesSeries ?? []}
              loading={dashboard.initialLoading}
            />
            <RevenueChart data={metrics?.revenueSeries ?? []} loading={dashboard.initialLoading} />
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <ChannelSummaryList
              channels={metrics?.channels ?? []}
              loading={dashboard.initialLoading}
            />
            <ExecutionsList
              executions={metrics?.executions ?? []}
              loading={dashboard.initialLoading}
            />
            <AttentionList attention={metrics?.attention ?? []} loading={dashboard.initialLoading} />
          </div>
        </>
      )}
    </AppShell>
  );
}
