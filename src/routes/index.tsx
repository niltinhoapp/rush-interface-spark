import { createFileRoute } from "@tanstack/react-router";
import { DashboardScreen } from "@/features/dashboard/screens/DashboardScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão geral — Nuvem Rush" },
      {
        name: "description",
        content:
          "Acompanhe automações ativas, mensagens enviadas, carrinhos recuperados e receita recuperada da sua loja Nuvemshop.",
      },
      { property: "og:title", content: "Visão geral — Nuvem Rush" },
      {
        property: "og:description",
        content: "Painel de automações de WhatsApp e e-mail para lojistas Nuvemshop.",
      },
    ],
  }),
  component: DashboardScreen,
});
