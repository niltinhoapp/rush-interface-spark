import { createFileRoute } from "@tanstack/react-router";
import { OrderDetailScreen } from "@/features/orders/screens/OrderDetailScreen";

export const Route = createFileRoute("/pedidos/$orderId")({
  head: () => ({
    meta: [
      { title: "Detalhe do pedido — Nuvem Rush" },
      {
        name: "description",
        content:
          "Linha do tempo do pedido com eventos de pagamento, envio, rastreio e mensagens enviadas ao cliente.",
      },
      { property: "og:title", content: "Detalhe do pedido — Nuvem Rush" },
      {
        property: "og:description",
        content: "Histórico completo de comunicação e rastreamento do pedido.",
      },
    ],
  }),
  component: OrderDetail,
});

function OrderDetail() {
  const { orderId } = Route.useParams();
  return <OrderDetailScreen orderId={orderId} />;
}
