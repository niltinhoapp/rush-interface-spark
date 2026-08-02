/**
 * Utilitários do construtor de automações — fábrica de fluxo e validação de formulário.
 * Sem regra de negócio real: apenas consistência da UI.
 */
import type {
  Condition,
  ConditionField,
  Flow,
  Step,
  FlowErrors,
  TimeUnit,
  ActionType,
} from "@/types/flow";
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
