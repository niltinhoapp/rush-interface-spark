import { createFileRoute } from "@tanstack/react-router";
import { IntegrationsScreen } from "@/features/integrations/screens/IntegrationsScreen";

export const Route = createFileRoute("/integracoes")({
  head: () => ({
    meta: [
      { title: "Integrações — Nuvem Rush" },
      {
        name: "description",
        content:
          "Status das integrações com Nuvemshop, WhatsApp Cloud API, e-mail e webhooks, com última sincronização.",
      },
      { property: "og:title", content: "Integrações — Nuvem Rush" },
      {
        property: "og:description",
        content: "Verifique conexões e erros de sincronização em um só lugar.",
      },
    ],
  }),
  component: IntegrationsScreen,
});
