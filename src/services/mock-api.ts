/**
 * Serviços simulados — substitua por chamadas reais à API do sistema Next.js.
 * Nenhum componente visual conhece a origem dos dados: todos recebem props
 * ou consomem estas funções.
 */
import { automations } from "@/data/automations";
import { carts } from "@/data/carts";
import { contacts } from "@/data/contacts";
import { dashboardMetrics } from "@/data/dashboard";
import { integrations } from "@/data/integrations";
import { messages } from "@/data/messages";
import { orders } from "@/data/orders";
import { emailTemplates, whatsappTemplates } from "@/data/templates";

const delay = <T,>(value: T, ms = 300) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

export const mockApi = {
  getDashboardMetrics: () => delay(dashboardMetrics),
  listAutomations: () => delay(automations),
  listCarts: () => delay(carts),
  listOrders: () => delay(orders),
  getOrder: (id: string) => delay(orders.find((o) => o.id === id) ?? null),
  listContacts: () => delay(contacts),
  listMessages: () => delay(messages),
  listWhatsappTemplates: () => delay(whatsappTemplates),
  listEmailTemplates: () => delay(emailTemplates),
  listIntegrations: () => delay(integrations),
};
