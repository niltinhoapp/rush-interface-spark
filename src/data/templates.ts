import type { EmailTemplate, WhatsappTemplate } from "@/types";

export const whatsappTemplates: WhatsappTemplate[] = [
  {
    id: "wt-1",
    name: "carrinho_volta_v2",
    category: "Marketing",
    language: "pt_BR",
    approval: "aprovado",
    content:
      "Oi {{1}}! Vimos que você deixou {{2}} no carrinho. Finalize agora e garanta seus itens: {{3}}",
    variables: ["nome", "produto", "link"],
    updatedAt: "2026-07-28",
  },
  {
    id: "wt-2",
    name: "rastreio_enviado_v3",
    category: "Utilidade",
    language: "pt_BR",
    approval: "aprovado",
    content: "Seu pedido {{1}} foi enviado! Código de rastreio: {{2}}. Acompanhe em {{3}}",
    variables: ["pedido", "codigo", "link"],
    updatedAt: "2026-07-22",
  },
  {
    id: "wt-3",
    name: "recompra_kit_v1",
    category: "Marketing",
    language: "pt_BR",
    approval: "em_analise",
    content: "{{1}}, já faz {{2}} dias desde sua última compra. Que tal repor seu kit? {{3}}",
    variables: ["nome", "dias", "link"],
    updatedAt: "2026-08-01",
  },
  {
    id: "wt-4",
    name: "pesquisa_satisfacao_v1",
    category: "Utilidade",
    language: "pt_BR",
    approval: "reprovado",
    content: "Oi {{1}}, o que achou do pedido {{2}}? Responda de 1 a 5.",
    variables: ["nome", "pedido"],
    updatedAt: "2026-07-18",
  },
];

export const emailTemplates: EmailTemplate[] = [
  {
    id: "et-1",
    name: "Carrinho — lembrete 24h",
    subject: "Ainda dá tempo de finalizar sua compra 🛒",
    content:
      "Olá {{nome}},\n\nSeparamos seus itens: {{produtos}}.\nFinalize em até 24h e garanta o frete calculado.\n\n{{link_carrinho}}",
    variables: ["nome", "produtos", "link_carrinho"],
    status: "aprovado",
    updatedAt: "2026-07-30",
  },
  {
    id: "et-2",
    name: "Pós-entrega — pesquisa",
    subject: "Como foi sua experiência com o pedido {{pedido}}?",
    content:
      "Olá {{nome}},\n\nSeu pedido {{pedido}} foi entregue. Conte pra gente como foi:\n{{link_pesquisa}}",
    variables: ["nome", "pedido", "link_pesquisa"],
    status: "aprovado",
    updatedAt: "2026-07-24",
  },
  {
    id: "et-3",
    name: "Pedido cancelado — recuperação",
    subject: "Podemos ajudar com seu pedido?",
    content: "Olá {{nome}}, notamos que o pedido {{pedido}} foi cancelado. {{pedido_url}}",
    variables: ["nome", "pedido", "pedido_url"],
    status: "rascunho",
    updatedAt: "2026-08-01",
  },
];
