import { createFileRoute } from "@tanstack/react-router";
import { CartsScreen } from "@/features/carts/screens/CartsScreen";

export const Route = createFileRoute("/carrinhos")({
  head: () => ({
    meta: [
      { title: "Carrinhos abandonados — Nuvem Rush" },
      {
        name: "description",
        content:
          "Acompanhe carrinhos abandonados, status de recuperação, valor potencial e mensagens enviadas.",
      },
      { property: "og:title", content: "Carrinhos abandonados — Nuvem Rush" },
      {
        property: "og:description",
        content: "Recuperação de carrinho por WhatsApp e e-mail com link de retorno.",
      },
    ],
  }),
  component: CartsScreen,
});
