/**
 * Contratos de serviço da interface Nuvem Rush.
 * O backend real (Next.js) deve implementar exatamente estas interfaces —
 * nenhuma tela precisa ser alterada na troca do mock pela API.
 */
import type {
  Automation,
  Cart,
  Contact,
  DashboardMetrics,
  EmailTemplate,
  ExecutionLog,
  Integration,
  Message,
  Order,
  WhatsappTemplate,
} from "@/types";
import type {
  AutomationFilters,
  CartFilters,
  ContactFilters,
  MessageFilters,
  OrderFilters,
  PaginatedResult,
  PeriodFilter,
} from "@/types/filters";
import type {
  EmailConnection,
  EmailSender,
  IntegrationTestResult,
  WhatsappConnection,
} from "@/types/connections";
import type { Flow } from "@/types/flow";

export type CreateAutomationInput = Flow;
export type UpdateAutomationInput = Partial<Flow>;

export interface DashboardService {
  getMetrics(period?: PeriodFilter): Promise<DashboardMetrics>;
}

export interface AutomationService {
  list(filters?: AutomationFilters): Promise<PaginatedResult<Automation>>;
  getById(id: string): Promise<Automation | null>;
  getFlow(id: string): Promise<Flow | null>;
  create(input: CreateAutomationInput): Promise<Automation>;
  update(id: string, input: UpdateAutomationInput): Promise<Automation>;
  duplicate(id: string): Promise<Automation>;
  activate(id: string): Promise<void>;
  pause(id: string): Promise<void>;
  remove(id: string): Promise<void>;
  executions(id: string): Promise<ExecutionLog[]>;
}

export interface OrderService {
  list(filters?: OrderFilters): Promise<PaginatedResult<Order>>;
  getById(id: string): Promise<Order | null>;
}

export interface CartService {
  list(filters?: CartFilters): Promise<PaginatedResult<Cart>>;
  getById(id: string): Promise<Cart | null>;
  reprocess(id: string): Promise<void>;
}

export interface ContactService {
  list(filters?: ContactFilters): Promise<PaginatedResult<Contact>>;
  getById(id: string): Promise<Contact | null>;
}

export interface MessageService {
  list(filters?: MessageFilters): Promise<PaginatedResult<Message>>;
  getById(id: string): Promise<Message | null>;
}

export interface TemplateService {
  listWhatsapp(): Promise<WhatsappTemplate[]>;
  listEmail(): Promise<EmailTemplate[]>;
}

export interface IntegrationService {
  list(): Promise<Integration[]>;
  test(id: string): Promise<IntegrationTestResult>;
}

export interface WhatsappService {
  getConnection(): Promise<WhatsappConnection>;
  connect(): Promise<WhatsappConnection>;
  reconnect(): Promise<WhatsappConnection>;
  refresh(): Promise<WhatsappConnection>;
  test(): Promise<IntegrationTestResult>;
  sendTestMessage(input: {
    phone: string;
    templateId: string;
    language: string;
    variables: Record<string, string>;
  }): Promise<IntegrationTestResult>;
}

export interface EmailService {
  getConnection(): Promise<EmailConnection>;
  listSenders(): Promise<EmailSender[]>;
  connect(): Promise<EmailConnection>;
  update(input: Partial<EmailConnection>): Promise<EmailConnection>;
  test(): Promise<IntegrationTestResult>;
  sendTestEmail(input: { to: string }): Promise<IntegrationTestResult>;
}

export interface NuvemRushServices {
  dashboard: DashboardService;
  automations: AutomationService;
  orders: OrderService;
  carts: CartService;
  contacts: ContactService;
  messages: MessageService;
  templates: TemplateService;
  integrations: IntegrationService;
  whatsapp: WhatsappService;
  email: EmailService;
}
