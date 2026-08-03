import { createFileRoute } from "@tanstack/react-router";
import { TemplatesScreen } from "@/features/templates/screens/TemplatesScreen";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — Nuvem Rush" },
      {
        name: "description",
        content:
          "Modelos de mensagem de WhatsApp e e-mail com variáveis, status de aprovação e prévia.",
      },
      { property: "og:title", content: "Templates — Nuvem Rush" },
      {
        property: "og:description",
        content: "Gerencie templates aprovados pela Meta e modelos de e-mail transacional.",
      },
    ],
  }),
  component: TemplatesScreen,
});
