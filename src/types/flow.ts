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

/** Payload mínimo persistido pelo backend. */
export type FlowPayload = Pick<Flow, "trigger" | "steps">;

export type FlowErrors = Record<string, string>;
