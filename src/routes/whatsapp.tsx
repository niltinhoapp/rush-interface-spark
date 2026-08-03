import { createFileRoute } from "@tanstack/react-router";
import { WhatsappScreen } from "@/features/whatsapp/screens/WhatsappScreen";

export const Route = createFileRoute("/whatsapp")({
  head: () => ({
    meta: [
      { title: "WhatsApp oficial — Nuvem Rush" },
      {
        name: "description",
        content:
          "Status da conexão WhatsApp Cloud API, número verificado, qualidade da conta e templates aprovados.",
      },
      { property: "og:title", content: "WhatsApp oficial — Nuvem Rush" },
      {
        property: "og:description",
        content: "Configuração e saúde do canal oficial de WhatsApp da sua loja.",
      },
    ],
  }),
  component: WhatsappScreen,
});
