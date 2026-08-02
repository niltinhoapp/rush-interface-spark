/**
 * Labels e enums centralizados — camada de apresentação, sem regra de negócio.
 */
import type {
  AutomationCategory,
  AutomationStatus,
  AutomationTrigger,
  CartRecoveryStatus,
  Channel,
  ConsentStatus,
  IntegrationStatus,
  MessageStatus,
  PaymentStatus,
  ShippingStatus,
  TemplateApproval,
} from "@/types";
import type {
  ConditionField,
  ConditionOperator,
  ActionType,
  TimeUnit,
  WebhookMethod,
} from "@/types/flow";
import type { PeriodPreset } from "@/types/filters";

export const triggerLabels: Record<AutomationTrigger, string> = {
  pedido_criado: "Pedido criado",
  pedido_pago: "Pedido pago",
  pedido_enviado: "Pedido enviado",
  pedido_cancelado: "Pedido cancelado",
  carrinho_abandonado: "Carrinho abandonado",
  pos_compra: "Pós-compra",
  recompra: "Recompra após período",
};

/** Gatilhos que aceitam quantidade + unidade de tempo. */
export const triggersWithOffset: AutomationTrigger[] = ["pos_compra", "recompra"];

export const categoryLabels: Record<AutomationCategory, string> = {
  carrinho: "Carrinho abandonado",
  pos_venda: "Pós-venda",
  rastreio: "Rastreio",
  recompra: "Recompra",
};

export const channelLabels: Record<Channel, string> = {
  whatsapp: "WhatsApp",
  email: "E-mail",
};

export const automationStatusLabels: Record<AutomationStatus, string> = {
  ativa: "Ativa",
  pausada: "Pausada",
  rascunho: "Rascunho",
  erro: "Erro",
};

export const cartStatusLabels: Record<CartRecoveryStatus, string> = {
  aguardando: "Aguardando",
  em_recuperacao: "Em recuperação",
  recuperado: "Recuperado",
  perdido: "Perdido",
};

export const paymentLabels: Record<PaymentStatus, string> = {
  pago: "Pago",
  pendente: "Pendente",
  estornado: "Estornado",
  cancelado: "Cancelado",
};

export const shippingLabels: Record<ShippingStatus, string> = {
  aguardando: "Aguardando",
  preparando: "Preparando",
  enviado: "Enviado",
  em_transito: "Em trânsito",
  entregue: "Entregue",
};

export const messageStatusLabels: Record<MessageStatus, string> = {
  agendada: "Agendada",
  enviada: "Enviada",
  entregue: "Entregue",
  lida: "Lida",
  falhou: "Falhou",
  cancelada: "Cancelada",
};

export const consentLabels: Record<ConsentStatus, string> = {
  aceito: "Aceito",
  pendente: "Pendente",
  recusado: "Recusado",
};

export const templateApprovalLabels: Record<TemplateApproval, string> = {
  aprovado: "Aprovado",
  em_analise: "Em análise",
  reprovado: "Reprovado",
  rascunho: "Rascunho",
};

export const integrationStatusLabels: Record<IntegrationStatus, string> = {
  conectado: "Conectado",
  desconectado: "Desconectado",
  atencao: "Atenção",
};

export const conditionFieldLabels: Record<ConditionField, string> = {
  produto: "Produto",
  sku: "SKU",
  categoria: "Categoria",
  marca: "Marca",
  valor_pedido: "Valor do pedido",
  quantidade_itens: "Quantidade de itens",
  tipo_cliente: "Cliente novo ou recorrente",
  forma_pagamento: "Forma de pagamento",
  status_pagamento: "Status do pagamento",
  estado_cliente: "Estado do cliente",
  consentimento: "Consentimento para comunicação",
};

export const conditionOperatorLabels: Record<ConditionOperator, string> = {
  eq: "Igual a",
  neq: "Diferente de",
  contains: "Contém",
  not_contains: "Não contém",
  gt: "Maior que",
  gte: "Maior ou igual",
  lt: "Menor que",
  lte: "Menor ou igual",
  in: "Está em",
  not_in: "Não está em",
};

/** Operadores permitidos por tipo de campo — apenas orientação visual. */
export const numericConditionFields: ConditionField[] = [
  "valor_pedido",
  "quantidade_itens",
];


export const actionTypeLabels: Record<ActionType, string> = {
  delay: "Esperar",
  send_whatsapp: "Enviar WhatsApp",
  send_email: "Enviar e-mail",
  add_tag: "Adicionar ou remover tag",
  webhook: "Chamar webhook",
};

export const timeUnitLabels: Record<TimeUnit, string> = {
  minutos: "Minutos",
  horas: "Horas",
  dias: "Dias",
};

export const webhookMethods: WebhookMethod[] = ["POST", "PUT", "PATCH"];

export const periodLabels: Record<PeriodPreset, string> = {
  hoje: "Hoje",
  "7d": "Últimos 7 dias",
  "30d": "Últimos 30 dias",
  custom: "Período personalizado",
};

/** Fallback padrão para dados que o backend ainda não fornece. */
export const NOT_PROVIDED = "Não informado";

const genericLabels: Record<string, string> = {
  ...automationStatusLabels,
  ...cartStatusLabels,
  ...messageStatusLabels,
  ...consentLabels,
  ...templateApprovalLabels,
  ...integrationStatusLabels,
};

export function humanizeStatus(value: string | null | undefined): string {
  if (!value) return NOT_PROVIDED;
  return genericLabels[value] ?? value.replace(/_/g, " ");
}

/** @deprecated compatibilidade — use `actionTypeLabels`. */
export const stepKindLabels = actionTypeLabels;
