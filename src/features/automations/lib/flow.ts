/**
 * Utilitários do construtor de automações — fábrica de fluxo e validação de formulário.
 * Sem regra de negócio real: apenas consistência da UI.
 */
import type {
  FlowPayload,
  Condition,
  ConditionField,
  Flow,
  Step,
  FlowErrors,
  TimeUnit,
  ActionType,
  TriggerType,
  ConditionOperator,
  ApiActionType,
  ApiConditionField,
  ApiConditionOp,
  ApiFlowStatus,
  ApiStep,
  ApiTrigger,
  ApiTriggerEvent,
  DelayUnit,
} from "@/types/flow";
import type { AutomationStatus } from "@/types";
import { numericConditionFields } from "@/lib/labels";

let sequence = 0;
export const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${sequence++}`;

export function createEmptyFlow(): Flow {
  return {
    name: "",
    trigger: { type: "carrinho_abandonado" },
    conditionMatch: "all",
    conditions: [],
    steps: [createStep("delay")],
    status: "rascunho",
  };
}

export function createCondition(): Condition {
  return { id: nextId("cond"), field: "produto", operator: "eq", value: "" };
}

export function createStep(kind: ActionType): Step {
  const id = nextId("step");
  switch (kind) {
    case "delay":
      return { id, type: "delay", amount: 30, unit: "minutos" };
    case "send_whatsapp":
      return {
        id,
        type: "send_whatsapp",
        templateId: "",
        language: "pt_BR",
        variables: {},
        recipientField: "cliente.telefone",
      };
    case "send_email":
      return { id, type: "send_email", templateId: "", senderId: "", subject: "", variables: {} };
    case "add_tag":
      return { id, type: "add_tag", tag: "", action: "add" };
    case "webhook":
    default:
      return {
        id,
        type: "webhook",
        url: "",
        method: "POST",
        headers: [{ id: nextId("hdr"), key: "Content-Type", value: "application/json" }],
        body: '{\n  "pedido": "{{pedido}}"\n}',
      };
  }
}

export function moveStep(steps: Step[], index: number, direction: -1 | 1) {
  const target = index + direction;
  if (target < 0 || target >= steps.length) return steps;
  const copy = [...steps];
  const [item] = copy.splice(index, 1);
  copy.splice(target, 0, item);
  return copy;
}

export function duplicateStep(step: Step): Step {
  return { ...step, id: nextId("step") };
}

export const isNumericField = (field: ConditionField) =>
  numericConditionFields.includes(field);

export function isValidHttpUrl(value: string): boolean {
  return /^https:\/\/[\w.-]+(\.[a-z]{2,})(\/\S*)?$/i.test(value.trim());
}

const unitLabel: Record<TimeUnit, string> = {
  minutos: "minuto(s)",
  horas: "hora(s)",
  dias: "dia(s)",
};

export function describeFlow(flow: Flow): string[] {
  return flow.steps.map((step) => {
    switch (step.type) {
      case "delay":
        return `Esperar ${step.amount} ${unitLabel[step.unit]}`;
      case "send_whatsapp":
        return `Enviar WhatsApp${step.templateId ? "" : " (template pendente)"}`;
      case "send_email":
        return `Enviar e-mail${step.templateId ? "" : " (template pendente)"}`;
      case "add_tag":
        return `${step.action === "add" ? "Adicionar" : "Remover"} tag ${step.tag || "(sem nome)"}`;
      case "webhook":
        return `Webhook ${step.method}${step.url ? "" : " (URL pendente)"}`;
      default:
        return "Etapa";
    }
  });
}

/** Valida o fluxo antes de salvar. Chaves seguem `campo` ou `step:<id>:<campo>`. */
export function validateFlow(flow: Flow): FlowErrors {
  const errors: FlowErrors = {};

  if (!flow.name.trim()) errors.name = "Informe um nome para a automação.";
  if (!flow.trigger.type) errors.trigger = "Selecione um gatilho.";
  if (
    (flow.trigger.type === "pos_compra" || flow.trigger.type === "recompra") &&
    (!flow.trigger.offsetAmount || flow.trigger.offsetAmount < 1)
  ) {
    errors.triggerOffset = "Informe uma quantidade de tempo maior que zero.";
  }

  flow.conditions.forEach((condition) => {
    const empty =
      condition.value === "" ||
      condition.value === null ||
      (Array.isArray(condition.value) && condition.value.length === 0);
    if (empty) errors[`cond:${condition.id}:value`] = "Informe um valor para a condição.";
    if (isNumericField(condition.field) && Number.isNaN(Number(condition.value))) {
      errors[`cond:${condition.id}:value`] = "Use um valor numérico.";
    }
  });

  const actionSteps = flow.steps.filter((step) => step.type !== "delay");
  if (actionSteps.length === 0) errors.steps = "Adicione pelo menos uma ação ao fluxo.";

  flow.steps.forEach((step) => {
    switch (step.type) {
      case "delay":
        if (!step.amount || step.amount < 1) {
          errors[`step:${step.id}:amount`] = "Informe um tempo de espera válido.";
        }
        break;
      case "send_whatsapp":
        if (!step.templateId) errors[`step:${step.id}:templateId`] = "Selecione um template aprovado.";
        if (!step.recipientField.trim()) {
          errors[`step:${step.id}:recipientField`] = "Informe o campo de destino.";
        }
        break;
      case "send_email":
        if (!step.templateId) errors[`step:${step.id}:templateId`] = "Selecione um template.";
        if (!step.senderId) errors[`step:${step.id}:senderId`] = "Selecione um remetente.";
        if (!step.subject.trim()) errors[`step:${step.id}:subject`] = "Informe o assunto.";
        break;
      case "add_tag":
        if (!step.tag.trim()) errors[`step:${step.id}:tag`] = "Informe o nome da tag.";
        break;
      case "webhook":
        if (!isValidHttpUrl(step.url)) {
          errors[`step:${step.id}:url`] = "Informe uma URL https válida.";
        }
        break;
    }
  });

  return errors;
}

/* ------------------------------------------------------------------ */
/* Serialização para o formato oficial do backend.                      */
/* A UI trata `delay` como passo próprio; aqui ele é fundido no passo    */
/* de ação seguinte (`step.delay`), como o backend espera.               */
/* ------------------------------------------------------------------ */

const triggerEventMap: Record<TriggerType, ApiTriggerEvent> = {
  pedido_criado: "order_created",
  pedido_pago: "order_paid",
  pedido_enviado: "order_fulfilled",
  pedido_cancelado: "order_created",
  carrinho_abandonado: "cart_abandoned",
  pos_compra: "order_paid",
  recompra: "order_paid",
};

const delayUnitMap: Record<TimeUnit, DelayUnit> = {
  minutos: "minutes",
  horas: "hours",
  dias: "days",
};

const statusMap: Record<AutomationStatus, ApiFlowStatus> = {
  ativa: "active",
  pausada: "paused",
  rascunho: "draft",
  erro: "paused",
};

const conditionFieldMap: Record<ConditionField, ApiConditionField> = {
  produto: "item.productId",
  sku: "item.sku",
  categoria: "item.category",
  marca: "item.brand",
  valor_pedido: "order.total",
  quantidade_itens: "order.itemsCount",
  tipo_cliente: "customer.type",
  forma_pagamento: "order.total",
  status_pagamento: "order.total",
  estado_cliente: "customer.type",
  consentimento: "customer.type",
};

const conditionOpMap: Record<ConditionOperator, ApiConditionOp> = {
  eq: "eq",
  neq: "neq",
  contains: "contains",
  not_contains: "neq",
  gt: "gt",
  gte: "gte",
  lt: "lt",
  lte: "lte",
  in: "in",
  not_in: "neq",
};

const actionMap: Record<Exclude<ActionType, "delay">, ApiActionType> = {
  send_whatsapp: "whatsapp",
  send_email: "email",
  add_tag: "tag",
  webhook: "webhook",
};

function stepConfig(step: Step): Record<string, unknown> | undefined {
  switch (step.type) {
    case "send_whatsapp":
      return {
        language: step.language,
        variables: step.variables,
        recipientField: step.recipientField,
      };
    case "send_email":
      return { senderId: step.senderId, subject: step.subject, variables: step.variables };
    case "add_tag":
      return { tag: step.tag, action: step.action };
    case "webhook":
      return {
        url: step.url,
        method: step.method,
        headers: Object.fromEntries(step.headers.map((h) => [h.key, h.value])),
        body: step.body,
      };
    default:
      return undefined;
  }
}

/** Converte os passos da UI em `ApiStep[]`, fundindo cada delay no passo seguinte. */
export function toApiSteps(steps: Step[]): ApiStep[] {
  const result: ApiStep[] = [];
  let pending = { value: 0, unit: "minutes" as DelayUnit };

  for (const step of steps) {
    if (step.type === "delay") {
      pending = { value: step.amount, unit: delayUnitMap[step.unit] };
      continue;
    }
    const apiStep: ApiStep = {
      delay: pending,
      action: actionMap[step.type],
    };
    if ("templateId" in step && step.templateId) apiStep.templateId = step.templateId;
    const config = stepConfig(step);
    if (config) apiStep.config = config;
    result.push(apiStep);
    pending = { value: 0, unit: "minutes" };
  }

  return result;
}

export function toApiTrigger(flow: Flow): ApiTrigger {
  return {
    event: triggerEventMap[flow.trigger.type],
    match: flow.conditionMatch,
    conditions: flow.conditions.map((condition) => ({
      field: conditionFieldMap[condition.field],
      op: conditionOpMap[condition.operator],
      value: condition.value,
    })),
  };
}

/** Payload de create/update no formato oficial: `{ name, status, trigger, steps }`. */
export function toFlowPayload(flow: Flow): FlowPayload {
  return {
    name: flow.name.trim(),
    status: statusMap[flow.status],
    trigger: toApiTrigger(flow),
    steps: toApiSteps(flow.steps),
  };
}
