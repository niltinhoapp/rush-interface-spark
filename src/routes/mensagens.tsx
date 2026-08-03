import { createFileRoute } from "@tanstack/react-router";
import { MessagesScreen } from "@/features/messages/screens/MessagesScreen";

export const Route = createFileRoute("/mensagens")({
  head: () => ({
    meta: [
      { title: "Mensagens — Nuvem Rush" },
      {
        name: "description",
        content:
          "Histórico de mensagens de WhatsApp e e-mail com status de entrega, leitura e motivo de erro.",
      },
      { property: "og:title", content: "Mensagens — Nuvem Rush" },
      {
        property: "og:description",
        content: "Auditoria completa dos disparos das suas automações.",
      },
    ],
  }),
  component: MessagesScreen,
});
