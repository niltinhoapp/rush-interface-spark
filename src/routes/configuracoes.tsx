import { createFileRoute } from "@tanstack/react-router";
import { SettingsScreen } from "@/features/settings/screens/SettingsScreen";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Nuvem Rush" },
      {
        name: "description",
        content:
          "Dados da loja, horários de envio, limites diários, preferências de notificação e plano da conta.",
      },
      { property: "og:title", content: "Configurações — Nuvem Rush" },
      {
        property: "og:description",
        content: "Ajuste preferências gerais do Nuvem Rush para sua loja.",
      },
    ],
  }),
  component: SettingsScreen,
});
