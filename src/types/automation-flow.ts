/**
 * Modelo do construtor de automações — apenas estrutura de dados.
 * Nenhuma regra de negócio real: a validação é de formulário/UI.
 */
import type { AutomationStatus, AutomationTrigger, Channel } from "./index";

export type TimeUnit = "minutos" | "horas" | "dias";

export interface AutomationTriggerConfig {
  type: AutomationTrigger;
  /** Usado apenas em pós-compra / recompra. */
  offsetAmount?: number;
  offsetUnit?: TimeUnit;
}

export type AutomationConditionField =
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

export type AutomationConditionOperator =
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

export type AutomationConditionValue = string | number | boolean | string[];

export interface AutomationCondition {
  id: string;
  field: AutomationConditionField;
  operator: AutomationConditionOperator;
  value: AutomationConditionValue;
}

export type ConditionMatch = "all" | "any";

export type AutomationStepKind = "delay" | "whatsapp" | "email" | "tag" | "webhook";

export interface StepBase {
  id: string;
  kind: AutomationStepKind;
  collapsed?: boolean;
}

export interface DelayStep extends StepBase {
  kind: "delay";
  amount: number;
  unit: TimeUnit;
}

export interface WhatsappStep extends StepBase {
  kind: "whatsapp";
  templateId: string;
  language: string;
  variables: Record<string, string>;
  recipientField: string;
}

export interface EmailStep extends StepBase {
  kind: "email";
  templateId: string;
  senderId: string;
  subject: string;
  variables: Record<string, string>;
}

export interface TagStep extends StepBase {
  kind: "tag";
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
  kind: "webhook";
  url: string;
  method: WebhookMethod;
  headers: WebhookHeader[];
  body: string;
}

export type AutomationStep = DelayStep | WhatsappStep | EmailStep | TagStep | WebhookStep;

export interface AutomationFlow {
  id?: string;
  name: string;
  description?: string;
  channelHint?: Channel;
  trigger: AutomationTriggerConfig;
  conditionMatch: ConditionMatch;
  conditions: AutomationCondition[];
  steps: AutomationStep[];
  status: AutomationStatus;
}

export type FlowErrors = Record<string, string>;
