/**
 * Implementação MOCK dos contratos de serviço.
 * Nenhuma chamada de rede, nenhum backend: apenas dados fictícios em memória.
 * Trocar por uma implementação real não exige alterar nenhuma tela.
 */
import {
  automations as automationSeed,
  carts as cartSeed,
  contacts as contactSeed,
  dashboardMetrics,
  emailConnection as emailSeed,
  emailSenders,
  emailTemplates,
  integrations as integrationSeed,
  messages as messageSeed,
  orders as orderSeed,
  whatsappConnection as whatsappSeed,
  whatsappTemplates,
} from "@/data/mocks";
import type {
  Automation,
  AutomationFilters,
  Cart,
  CartFilters,
  Contact,
  ContactFilters,
  DashboardMetrics,
  EmailConnection,
  ExecutionLog,
  Message,
  MessageFilters,
  Order,
  OrderFilters,
  PaginatedResult,
  PeriodFilter,
  WhatsappConnection,
} from "@/types";
import type { AutomationFlow } from "@/types/automation-flow";
import type {
  AutomationService,
  CartService,
  ContactService,
  CreateAutomationInput,
  DashboardService,
  EmailService,
  IntegrationService,
  MessageService,
  NuvemRushServices,
  OrderService,
  TemplateService,
  UpdateAutomationInput,
  WhatsappService,
} from "@/services/contracts";

const LATENCY = 320;

const delay = <T,>(value: T, ms = LATENCY): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });

function paginate<T>(rows: T[], page = 1, pageSize = 10): PaginatedResult<T> {
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;
  return {
    data: rows.slice(start, start + pageSize),
    page: current,
    pageSize,
    total,
    totalPages,
  };
}

const contains = (haystack: string | null | undefined, needle?: string) =>
  !needle || (haystack ?? "").toLowerCase().includes(needle.trim().toLowerCase());

function sortRows<T>(rows: T[], sortBy?: string, dir: "asc" | "desc" = "desc"): T[] {
  if (!sortBy) return rows;
  const factor = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = (a as Record<string, unknown>)[sortBy];
    const bv = (b as Record<string, unknown>)[sortBy];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * factor;
    return String(av ?? "").localeCompare(String(bv ?? ""), "pt-BR") * factor;
  });
}

/* ------------------------------------------------------------------ */
/* Estado em memória                                                    */
/* ------------------------------------------------------------------ */

let automationStore: Automation[] = [...automationSeed];
const flowStore = new Map<string, AutomationFlow>();

let whatsappState: WhatsappConnection = { ...whatsappSeed };
let emailState: EmailConnection = { ...emailSeed };

function toFlow(automation: Automation): AutomationFlow {
  const existing = flowStore.get(automation.id);
  if (existing) return existing;
  const flow: AutomationFlow = {
    id: automation.id,
    name: automation.name,
    status: automation.status,
    channelHint: automation.channel,
    trigger: {
      type: automation.trigger,
      offsetAmount: automation.trigger === "recompra" ? 45 : undefined,
      offsetUnit: automation.trigger === "recompra" ? "dias" : undefined,
    },
    conditionMatch: "all",
    conditions: [],
    steps: [
      { id: `${automation.id}-delay`, kind: "delay", amount: 30, unit: "minutos" },
      automation.channel === "whatsapp"
        ? {
            id: `${automation.id}-msg`,
            kind: "whatsapp",
            templateId: whatsappTemplates[0]?.id ?? "",
            language: "pt_BR",
            variables: {},
            recipientField: "cliente.telefone",
          }
        : {
            id: `${automation.id}-msg`,
            kind: "email",
            templateId: emailTemplates[0]?.id ?? "",
            senderId: emailSenders[0]?.id ?? "",
            subject: emailTemplates[0]?.subject ?? "",
            variables: {},
          },
    ],
  };
  flowStore.set(automation.id, flow);
  return flow;
}

function flowToAutomation(flow: AutomationFlow, base?: Automation): Automation {
  const hasWhatsapp = flow.steps.some((s) => s.kind === "whatsapp");
  return {
    id: base?.id ?? flow.id ?? `aut-${Date.now()}`,
    name: flow.name,
    trigger: flow.trigger.type,
    category:
      base?.category ??
      (flow.trigger.type === "carrinho_abandonado"
        ? "carrinho"
        : flow.trigger.type === "pedido_enviado"
          ? "rastreio"
          : flow.trigger.type === "recompra"
            ? "recompra"
            : "pos_venda"),
    channel: hasWhatsapp ? "whatsapp" : "email",
    status: flow.status,
    runs: base?.runs ?? 0,
    lastRunAt: base?.lastRunAt ?? "—",
    successRate: base?.successRate ?? 0,
    needsAttention: base?.needsAttention,
  };
}

/* ------------------------------------------------------------------ */
/* Serviços                                                             */
/* ------------------------------------------------------------------ */

const dashboardService: DashboardService = {
  getMetrics: (period?: PeriodFilter) => {
    const factor = period?.preset === "hoje" ? 0.06 : period?.preset === "7d" ? 0.28 : 1;
    const scale = (n: number) => Math.round(n * factor);
    const metrics: DashboardMetrics = {
      ...dashboardMetrics,
      activeAutomations: automationStore.filter((a) => a.status === "ativa").length,
      messagesSent: scale(dashboardMetrics.messagesSent),
      messagesDelivered: scale(dashboardMetrics.messagesDelivered),
      messagesFailed: scale(dashboardMetrics.messagesFailed),
      cartsRecovered: scale(dashboardMetrics.cartsRecovered),
      recoveredRevenue: Math.round(dashboardMetrics.recoveredRevenue * factor),
      ordersTracked: scale(dashboardMetrics.ordersTracked),
      contactsReached: scale(dashboardMetrics.contactsReached),
      attention: automationStore.filter((a) => a.needsAttention),
    };
    return delay(metrics);
  },
};

const automationService: AutomationService = {
  list: (filters: AutomationFilters = {}) => {
    let rows = automationStore.filter((a) => contains(a.name, filters.search));
    if (filters.status) rows = rows.filter((a) => a.status === filters.status);
    if (filters.channel) rows = rows.filter((a) => a.channel === filters.channel);
    if (filters.category) rows = rows.filter((a) => a.category === filters.category);
    rows = sortRows(rows, filters.sortBy, filters.sortDir);
    return delay(paginate(rows, filters.page, filters.pageSize));
  },
  getById: (id) => delay(automationStore.find((a) => a.id === id) ?? null),
  getFlow: (id) => {
    const automation = automationStore.find((a) => a.id === id);
    return delay(automation ? toFlow(automation) : null);
  },
  create: (input: CreateAutomationInput) => {
    const automation = flowToAutomation({ ...input, id: `aut-${Date.now()}` });
    automationStore = [automation, ...automationStore];
    flowStore.set(automation.id, { ...input, id: automation.id });
    return delay(automation);
  },
  update: (id, input: UpdateAutomationInput) => {
    const base = automationStore.find((a) => a.id === id);
    const current = base ? toFlow(base) : null;
    const merged: AutomationFlow = { ...(current as AutomationFlow), ...input, id };
    const updated = flowToAutomation(merged, base);
    automationStore = automationStore.map((a) => (a.id === id ? updated : a));
    flowStore.set(id, merged);
    return delay(updated);
  },
  duplicate: (id) => {
    const base = automationStore.find((a) => a.id === id);
    if (!base) return Promise.reject(new Error("Automação não encontrada"));
    const copy: Automation = {
      ...base,
      id: `${base.id}-copy-${automationStore.length + 1}`,
      name: `${base.name} (cópia)`,
      status: "rascunho",
      runs: 0,
      lastRunAt: "—",
      successRate: 0,
      needsAttention: undefined,
    };
    automationStore = [copy, ...automationStore];
    return delay(copy);
  },
  activate: (id) => {
    automationStore = automationStore.map((a) => (a.id === id ? { ...a, status: "ativa" } : a));
    return delay(undefined);
  },
  pause: (id) => {
    automationStore = automationStore.map((a) => (a.id === id ? { ...a, status: "pausada" } : a));
    return delay(undefined);
  },
  remove: (id) => {
    automationStore = automationStore.filter((a) => a.id !== id);
    flowStore.delete(id);
    return delay(undefined);
  },
  executions: (id) => {
    const automation = automationStore.find((a) => a.id === id);
    const rows: ExecutionLog[] = dashboardMetrics.executions.filter(
      (e) => !automation || e.automation === automation.name,
    );
    return delay(rows.length ? rows : dashboardMetrics.executions.slice(0, 3));
  },
};

const orderService: OrderService = {
  list: (filters: OrderFilters = {}) => {
    let rows: Order[] = orderSeed.filter(
      (o) => contains(o.customer, filters.search) || contains(o.number, filters.search),
    );
    if (filters.payment) rows = rows.filter((o) => o.payment === filters.payment);
    if (filters.shipping) rows = rows.filter((o) => o.shipping === filters.shipping);
    if (filters.automation) rows = rows.filter((o) => o.automation === filters.automation);
    rows = sortRows(rows, filters.sortBy, filters.sortDir);
    return delay(paginate(rows, filters.page, filters.pageSize));
  },
  getById: (id) => delay(orderSeed.find((o) => o.id === id || o.number === id) ?? null),
};

const cartService: CartService = {
  list: (filters: CartFilters = {}) => {
    let rows: Cart[] = cartSeed.filter((c) => contains(c.customer, filters.search));
    if (filters.status) rows = rows.filter((c) => c.status === filters.status);
    if (filters.channel) rows = rows.filter((c) => c.channel === filters.channel);
    rows = sortRows(rows, filters.sortBy, filters.sortDir);
    return delay(paginate(rows, filters.page, filters.pageSize));
  },
  getById: (id) => delay(cartSeed.find((c) => c.id === id) ?? null),
  reprocess: () => delay(undefined, 500),
};

const contactService: ContactService = {
  list: (filters: ContactFilters = {}) => {
    let rows: Contact[] = contactSeed.filter(
      (c) => contains(c.name, filters.search) || contains(c.email, filters.search),
    );
    if (filters.consent) rows = rows.filter((c) => c.consent === filters.consent);
    if (filters.customerType) {
      rows = rows.filter((c) => (filters.customerType === "novo" ? c.orders <= 1 : c.orders > 1));
    }
    if (filters.tag) rows = rows.filter((c) => c.tags.includes(filters.tag as string));
    rows = sortRows(rows, filters.sortBy, filters.sortDir);
    return delay(paginate(rows, filters.page, filters.pageSize));
  },
  getById: (id) => delay(contactSeed.find((c) => c.id === id) ?? null),
};

const messageService: MessageService = {
  list: (filters: MessageFilters = {}) => {
    let rows: Message[] = messageSeed.filter(
      (m) => contains(m.customer, filters.search) || contains(m.template, filters.search),
    );
    if (filters.channel) rows = rows.filter((m) => m.channel === filters.channel);
    if (filters.status) rows = rows.filter((m) => m.status === filters.status);
    if (filters.automation) rows = rows.filter((m) => m.automation === filters.automation);
    if (filters.orderNumber) rows = rows.filter((m) => m.orderNumber === filters.orderNumber);
    rows = sortRows(rows, filters.sortBy, filters.sortDir);
    return delay(paginate(rows, filters.page, filters.pageSize));
  },
  getById: (id) => delay(messageSeed.find((m) => m.id === id) ?? null),
};

const templateService: TemplateService = {
  listWhatsapp: () => delay(whatsappTemplates),
  listEmail: () => delay(emailTemplates),
};

const integrationService: IntegrationService = {
  list: () => delay(integrationSeed),
  test: (id) => {
    const integration = integrationSeed.find((i) => i.id === id);
    const ok = integration?.status === "conectado";
    return delay(
      {
        ok,
        message: ok
          ? "Conexão respondendo normalmente (simulação)."
          : "Não foi possível validar a conexão nesta demonstração.",
        checkedAt: new Date().toISOString(),
      },
      900,
    );
  },
};

const whatsappService: WhatsappService = {
  getConnection: () => delay(whatsappState),
  connect: () => {
    whatsappState = { ...whatsappState, status: "conectado" };
    return delay(whatsappState, 900);
  },
  reconnect: () => {
    whatsappState = { ...whatsappState, status: "conectado", error: null };
    return delay(whatsappState, 900);
  },
  refresh: () => {
    whatsappState = { ...whatsappState, lastSyncAt: new Date().toISOString() };
    return delay(whatsappState, 600);
  },
  test: () =>
    delay(
      { ok: true, message: "Conexão validada (simulação).", checkedAt: new Date().toISOString() },
      900,
    ),
  sendTestMessage: () =>
    delay(
      {
        ok: true,
        message: "Mensagem de teste enfileirada (simulação).",
        checkedAt: new Date().toISOString(),
      },
      900,
    ),
};

const emailService: EmailService = {
  getConnection: () => delay(emailState),
  listSenders: () => delay(emailSenders),
  connect: () => {
    emailState = { ...emailState, status: "conectado" };
    return delay(emailState, 900);
  },
  update: (input) => {
    emailState = { ...emailState, ...input };
    return delay(emailState, 600);
  },
  test: () =>
    delay(
      {
        ok: emailState.status === "conectado",
        message:
          emailState.status === "conectado"
            ? "Servidor de envio respondeu (simulação)."
            : "Configuração incompleta: verifique o domínio.",
        checkedAt: new Date().toISOString(),
      },
      900,
    ),
  sendTestEmail: () =>
    delay(
      {
        ok: true,
        message: "E-mail de teste enfileirado (simulação).",
        checkedAt: new Date().toISOString(),
      },
      900,
    ),
};

export const mockServices: NuvemRushServices = {
  dashboard: dashboardService,
  automations: automationService,
  orders: orderService,
  carts: cartService,
  contacts: contactService,
  messages: messageService,
  templates: templateService,
  integrations: integrationService,
  whatsapp: whatsappService,
  email: emailService,
};
