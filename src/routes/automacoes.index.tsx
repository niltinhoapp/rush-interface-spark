import { createFileRoute } from "@tanstack/react-router";
import { AutomationsScreen } from "@/features/automations/screens/AutomationsScreen";

export const Route = createFileRoute("/automacoes/")({
  head: () => ({
    meta: [
      { title: "Automações — Nuvem Rush" },
      {
        name: "description",
        content:
          "Gerencie automações de carrinho abandonado, pós-venda, rastreio e recompra por WhatsApp e e-mail.",
      },
      { property: "og:title", content: "Automações — Nuvem Rush" },
      {
        property: "og:description",
        content: "Lista de automações com gatilho, canal, execuções e taxa de sucesso.",
      },
    ],
  }),
  component: AutomationsScreen,
});
