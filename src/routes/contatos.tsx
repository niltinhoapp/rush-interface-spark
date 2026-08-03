import { createFileRoute } from "@tanstack/react-router";
import { ContactsScreen } from "@/features/contacts/screens/ContactsScreen";

export const Route = createFileRoute("/contatos")({
  head: () => ({
    meta: [
      { title: "Contatos — Nuvem Rush" },
      {
        name: "description",
        content:
          "Base de clientes com histórico de compras, tags, consentimento de comunicação e última interação.",
      },
      { property: "og:title", content: "Contatos — Nuvem Rush" },
      {
        property: "og:description",
        content: "Gerencie sua base de contatos e o consentimento de WhatsApp e e-mail.",
      },
    ],
  }),
  component: ContactsScreen,
});
