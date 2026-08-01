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
