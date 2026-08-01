import type { EmailConnection, EmailSender, WhatsappConnection } from "@/types";

/** Dados fictícios — nenhum identificador ou credencial real. */
export const whatsappConnection: WhatsappConnection = {
  status: "conectado",
  phone: "+55 11 4002-8922",
  businessName: "Loja Rush",
  wabaId: "demo-waba-0000-1109",
  phoneNumberId: "demo-phone-0000-8842",
  quality: "alta",
  messagingLimit: "10.000 conversas / 24h",
  accountStatus: "Ativa",
  lastSyncAt: "2026-08-01T22:40:00Z",
  warnings: [
    "Template recompra_kit_v1 aguarda aprovação da Meta.",
    "Template pesquisa_satisfacao_v1 foi reprovado — revise o conteúdo.",
  ],
  error: null,
};

export const emailConnection: EmailConnection = {
  status: "incompleto",
  senderName: "Loja Rush",
  senderEmail: "contato@exemplo-lojarush.com.br",
  replyTo: "suporte@exemplo-lojarush.com.br",
  provider: "SMTP dedicado",
  domain: "exemplo-lojarush.com.br",
  domainVerified: false,
  spf: "verificado",
  dkim: "pendente",
  lastSyncAt: "2026-08-01T20:10:00Z",
  stats: [
    { label: "Enviados (30d)", value: "18.420" },
    { label: "Taxa de entrega", value: "97,8%" },
    { label: "Taxa de abertura", value: "42,1%" },
    { label: "Descadastros", value: "0,4%" },
  ],
  warnings: ["Registro DKIM pendente de verificação no domínio."],
  error: null,
};

export const emailSenders: EmailSender[] = [
  { id: "snd-1", name: "Loja Rush", email: "contato@exemplo-lojarush.com.br", verified: true },
  { id: "snd-2", name: "Atendimento", email: "suporte@exemplo-lojarush.com.br", verified: true },
  { id: "snd-3", name: "Novidades", email: "news@exemplo-lojarush.com.br", verified: false },
];
