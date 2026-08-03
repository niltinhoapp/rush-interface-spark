import { createFileRoute } from "@tanstack/react-router";
import { AutomationBuilderScreen } from "@/features/automations/screens/AutomationBuilderScreen";

export const Route = createFileRoute("/automacoes/nova")({
  head: () => ({
    meta: [
      { title: "Nova automação — Nuvem Rush" },
      {
        name: "description",
        content:
          "Monte uma automação escolhendo gatilho, condições, tempo de espera, canal e template de mensagem.",
      },
      { property: "og:title", content: "Nova automação — Nuvem Rush" },
      {
        property: "og:description",
        content: "Construtor visual de fluxos de pós-venda e recuperação de carrinho.",
      },
    ],
  }),
  component: AutomationBuilderScreen,
});
