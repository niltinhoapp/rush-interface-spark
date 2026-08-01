import type { Integration } from "@/types";

export const integrations: Integration[] = [
  {
    id: "int-nuvemshop",
    name: "Nuvemshop",
    description: "Sincroniza pedidos, carrinhos, produtos e clientes da sua loja.",
    status: "conectado",
    lastSyncAt: "há 3 minutos",
  },
  {
    id: "int-whatsapp",
    name: "WhatsApp Cloud API",
    description: "Envio oficial de mensagens transacionais e de marketing.",
    status: "conectado",
    lastSyncAt: "há 8 minutos",
  },
  {
    id: "int-email",
    name: "E-mail",
    description: "Domínio verificado e envio por provedor SMTP.",
    status: "atencao",
    lastSyncAt: "há 2 horas",
    error: "Registro DKIM pendente de verificação no domínio lojarush.com.br.",
  },
  {
    id: "int-webhooks",
    name: "Webhooks",
    description: "Notificações de eventos para sistemas externos.",
    status: "desconectado",
    lastSyncAt: "—",
  },
];

export const whatsappConnection = {
  connected: true,
  phone: "+55 11 4002-8922",
  businessName: "Loja Rush",
  waba: "WABA-8842-1109",
  quality: "Alta",
  accountStatus: "Ativa",
  messagingLimit: "10.000 conversas / 24h",
  warnings: [
    "Template recompra_kit_v1 aguarda aprovação da Meta.",
    "Template pesquisa_satisfacao_v1 foi reprovado — revise o conteúdo.",
  ],
};

export const emailConnection = {
  connected: true,
  senderName: "Loja Rush",
  senderEmail: "contato@lojarush.com.br",
  domain: "lojarush.com.br",
  provider: "SMTP dedicado",
  stats: [
    { label: "Enviados (30d)", value: "18.420" },
    { label: "Taxa de entrega", value: "97,8%" },
    { label: "Taxa de abertura", value: "42,1%" },
    { label: "Descadastros", value: "0,4%" },
  ],
  warnings: ["Registro DKIM pendente de verificação."],
};
