import { createFileRoute } from "@tanstack/react-router";
import { OrdersScreen } from "@/features/orders/screens/OrdersScreen";

export const Route = createFileRoute("/pedidos/")({
  head: () => ({
    meta: [
      { title: "Pedidos — Nuvem Rush" },
      {
        name: "description",
        content:
          "Lista de pedidos com status de pagamento, envio, código de rastreio e automações vinculadas.",
      },
      { property: "og:title", content: "Pedidos — Nuvem Rush" },
      {
        property: "og:description",
        content: "Acompanhe pedidos e o rastreamento comunicado aos clientes.",
      },
    ],
  }),
  component: OrdersScreen,
});
