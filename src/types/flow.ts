/**
 * Modelo de domínio OFICIAL dos fluxos do Nuvem Rush.
 * Estes são os tipos que o backend (Next.js 16 + Firestore) espera receber:
 * Flow, Trigger, Condition, Step e ActionType.
 *
 * O objeto persistido é sempre `{ trigger, steps: Step[] }` (mais metadados do fluxo).
 * Nenhuma regra de negócio aqui — apenas estrutura de dados.
 */
import type { AutomationStatus, AutomationTrigger, Channel } from "./index";

export type TimeUnit = "minutos" | "horas" | "dias";

/** Tipos de gatilho aceitos pelo backend. */
export type TriggerType = AutomationTrigger;

export interface Trigger {
  type: TriggerType;
  /** Usado apenas em pós-compra / recompra. */
  offsetAmount?: number;
  offsetUnit?: TimeUnit;
}

export type ConditionField =
  | "produto"
  | "sku"
  | "categoria"
  | "marca"
  | "valor_pedido"
  | "quantidade_itens"
  | "tipo_cliente"
  | "forma_pagamento"
  | "status_pagamento"
  | "estado_cliente"
  | "consentimento";

export type ConditionOperator =
  | "eq"
  | "neq"
  | "contains"
  | "not_contains"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "not_in";

export type ConditionValue = string | number | boolean | string[];

export interface Condition {
  id: string;
  field: ConditionField;
  operator: ConditionOperator;
  value: ConditionValue;
}

export type ConditionMatch = "all" | "any";

/** Discriminante de `Step`. */
export type ActionType = "delay" | "send_whatsapp" | "send_email" | "add_tag" | "webhook";

export interface StepBase {
  id: string;
  type: ActionType;
  collapsed?: boolean;
}

export interface DelayStep extends StepBase {
  type: "delay";
  amount: number;
  unit: TimeUnit;
}

export interface SendWhatsappStep extends StepBase {
  type: "send_whatsapp";
  templateId: string;
  language: string;
  variables: Record<string, string>;
  recipientField: string;
}

export interface SendEmailStep extends StepBase {
  type: "send_email";
  templateId: string;
  senderId: string;
  subject: string;
  variables: Record<string, string>;
}

export interface AddTagStep extends StepBase {
  type: "add_tag";
  tag: string;
  action: "add" | "remove";
}

export interface WebhookHeader {
  id: string;
  key: string;
  value: string;
  secret?: boolean;
}

export type WebhookMethod = "POST" | "PUT" | "PATCH";

export interface WebhookStep extends StepBase {
  type: "webhook";
  url: string;
  method: WebhookMethod;
  headers: WebhookHeader[];
  body: string;
}

export type Step = DelayStep | SendWhatsappStep | SendEmailStep | AddTagStep | WebhookStep;

export interface Flow {
  id?: string;
  name: string;
  description?: string;
  channelHint?: Channel;
  trigger: Trigger;
  conditionMatch: ConditionMatch;
  conditions: Condition[];
  steps: Step[];
  status: AutomationStatus;
}

export type FlowErrors = Record<string, string>;

/* ------------------------------------------------------------------ */
/* Modelo OFICIAL do backend (wire format nuvem-rush/types/index.ts).   */
/* A UI edita `Flow` (pt-BR, delay como passo próprio); ao salvar,      */
/* `toFlowPayload` converte para as estruturas abaixo.                  */
/* ------------------------------------------------------------------ */

/** Ação oficial — `delay` NÃO é ação, é campo obrigatório do step. */
export type ApiActionType = "email" | "whatsapp" | "tag" | "webhook" | "task";

export type DelayUnit = "minutes" | "hours" | "days";

export type ApiTriggerEvent =
  | "order_paid"
  | "order_created"
  | "order_fulfilled"
  | "cart_abandoned";

export type ApiConditionMatch = "all" | "any";

export type ApiConditionOp = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "contains";

export type ApiConditionField =
  | "order.total"
  | "order.itemsCount"
  | "item.sku"
  | "item.productId"
  | "item.category"
  | "item.brand"
  | "customer.type";

/** Valores aceitos por `customer.type`. */
export type ApiCustomerType = "first_purchase" | "recurring";

export interface ApiCondition {
  field: ApiConditionField;
  op: ApiConditionOp;
  value: ConditionValue;
}

export interface ApiTrigger {
  event: ApiTriggerEvent;
  match: ApiConditionMatch;
  conditions: ApiCondition[];
}

export interface ApiStep {
  /** Sempre presente: o "quando" do passo. */
  delay: { value: number; unit: DelayUnit };
  /** O "o quê". */
  action: ApiActionType;
  templateId?: string;
  /** Se preenchido, conteúdo gerado por IA. */
  aiPrompt?: string;
  /** Config específica da ação (tag, url do webhook, remetente, etc.). */
  config?: Record<string, unknown>;
}

export type ApiFlowStatus = "active" | "paused" | "draft";

/** Payload de create/update. Os demais campos (flowId, stats, createdAt) são do servidor. */
export interface FlowPayload {
  name: string;
  status: ApiFlowStatus;
  trigger: ApiTrigger;
  steps: ApiStep[];
}

/** Documento completo devolvido pelo backend. */
export interface ApiFlow extends FlowPayload {
  flowId: string;
  stats?: Record<string, number>;
  createdAt?: string;
}

