/**
 * Hooks de dados — única ponte entre as telas e a camada de serviços.
 * As telas nunca importam mocks nem conhecem a origem dos dados.
 */
import { useCallback, useState } from "react";
import { services } from "@/services";
import type {
  Automation,
  AutomationFilters,
  Cart,
  CartFilters,
  Contact,
  ContactFilters,
  DashboardMetrics,
  EmailTemplate,
  Integration,
  Message,
  MessageFilters,
  Order,
  OrderFilters,
  PeriodFilter,
  WhatsappTemplate,
} from "@/types";
import type { AutomationFlow } from "@/types/automation-flow";
import { useAsyncData } from "./useAsyncData";
import { useListResource } from "./useListResource";

export function useDashboard(period: PeriodFilter) {
  const key = JSON.stringify(period);
  return useAsyncData<DashboardMetrics>(() => services.dashboard.getMetrics(period), [key]);
}

export function useAutomations(initial: AutomationFilters = {}) {
  return useListResource<Automation, AutomationFilters>(
    (filters) => services.automations.list(filters),
    initial,
  );
}

export function useAutomation(id: string | null) {
  return useAsyncData<Automation | null>(
    () => (id ? services.automations.getById(id) : Promise.resolve(null)),
    [id],
  );
}

export function useAutomationFlow(id: string | null) {
  return useAsyncData<AutomationFlow | null>(
    () => (id ? services.automations.getFlow(id) : Promise.resolve(null)),
    [id],
  );
}

export function useOrders(initial: OrderFilters = {}) {
  return useListResource<Order, OrderFilters>((filters) => services.orders.list(filters), initial);
}

export function useOrder(id: string | null) {
  return useAsyncData<Order | null>(
    () => (id ? services.orders.getById(id) : Promise.resolve(null)),
    [id],
  );
}

export function useCarts(initial: CartFilters = {}) {
  return useListResource<Cart, CartFilters>((filters) => services.carts.list(filters), initial);
}

export function useContacts(initial: ContactFilters = {}) {
  return useListResource<Contact, ContactFilters>(
    (filters) => services.contacts.list(filters),
    initial,
  );
}

export function useMessages(initial: MessageFilters = {}) {
  return useListResource<Message, MessageFilters>(
    (filters) => services.messages.list(filters),
    initial,
  );
}

export function useTemplates() {
  return useAsyncData<{ whatsapp: WhatsappTemplate[]; email: EmailTemplate[] }>(
    async () => ({
      whatsapp: await services.templates.listWhatsapp(),
      email: await services.templates.listEmail(),
    }),
    [],
  );
}

export function useIntegrations() {
  const state = useAsyncData<Integration[]>(() => services.integrations.list(), []);
  const [testingId, setTestingId] = useState<string | null>(null);

  const test = useCallback(async (id: string) => {
    setTestingId(id);
    try {
      return await services.integrations.test(id);
    } finally {
      setTestingId(null);
    }
  }, []);

  return { ...state, testingId, test };
}

export function useWhatsappConnection() {
  return useAsyncData(() => services.whatsapp.getConnection(), []);
}

export function useEmailConnection() {
  return useAsyncData(
    async () => ({
      connection: await services.email.getConnection(),
      senders: await services.email.listSenders(),
    }),
    [],
  );
}

/** Executa uma ação de serviço controlando estado de envio e feedback. */
export function useAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      setPending(true);
      setError(null);
      try {
        return await action(...args);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Ação não concluída.");
        return null;
      } finally {
        setPending(false);
      }
    },
    [action],
  );

  return { run, pending, error };
}
