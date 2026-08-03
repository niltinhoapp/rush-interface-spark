import { createFileRoute } from "@tanstack/react-router";
import { EmailScreen } from "@/features/email/screens/EmailScreen";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "E-mail — Nuvem Rush" },
      {
        name: "description",
        content:
          "Remetente verificado, domínio, taxa de entrega e templates de e-mail das automações da loja.",
      },
      { property: "og:title", content: "E-mail — Nuvem Rush" },
      {
        property: "og:description",
        content: "Configuração do canal de e-mail transacional e de recuperação.",
      },
    ],
  }),
  component: EmailScreen,
});
