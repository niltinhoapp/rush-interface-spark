/**
 * Entidades da interface Nuvem Rush.
 * Somente tipos visuais — nenhuma regra de negócio aqui.
 */

export type Channel = "whatsapp" | "email";

export type AutomationStatus = "ativa" | "pausada" | "rascunho" | "erro";

export type AutomationTrigger =
  | "pedido_criado"
  | "pedido_pago"
  | "pedido_enviado"
  | "pedido_cancelado"
  | "carrinho_abandonado"
  | "pos_compra"
  | "recompra";

export type AutomationCategory =
  | "carrinho"
  | "pos_venda"
  | "rastreio"
  | "recompra";

export interface Automation {
  id: string;
  name: string;
  trigger: AutomationTrigger;
  category: AutomationCategory;
  channel: Channel;
  status: AutomationStatus;
  runs: number;
  lastRunAt: string;
  successRate: number;
  needsAttention?: string;
}

export type CartRecoveryStatus =
  | "aguardando"
  | "em_recuperacao"
  | "recuperado"
  | "perdido";

export interface CartItem {
  name: string;
  quantity: number;
}

export interface Cart {
  id: string;
  customer: string;
  phone: string;
  email: string;
  value: number;
  items: CartItem[];
  abandonedAt: string;
  status: CartRecoveryStatus;
  automation: string;
  recoveryLink: string;
  recoveredValue: number;
  channel: Channel;
}

export type PaymentStatus = "pago" | "pendente" | "estornado" | "cancelado";
export type ShippingStatus =
  | "aguardando"
  | "preparando"
  | "enviado"
  | "em_transito"
  | "entregue";

export interface OrderEvent {
  id: string;
  at: string;
  title: string;
  description: string;
  channel?: Channel;
  tone: "info" | "success" | "warning" | "error";
}

export interface OrderItem {
  id: string;
  name: string;
  sku?: string | null;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  number: string;
  customer: string;
  value: number;
  payment: PaymentStatus;
  shipping: ShippingStatus;
  tracking: string | null;
  automation: string;
  lastMessage: string;
  createdAt: string;
  timeline: OrderEvent[];
  /** Campos opcionais: podem não vir do backend — exibir "Não informado". */
  customerEmail?: string | null;
  customerPhone?: string | null;
  items?: OrderItem[];
  shippingCost?: number | null;
  deliveredAt?: string | null;
  shippingAddress?: string | null;
}

export type ConsentStatus = "aceito" | "pendente" | "recusado";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastPurchaseAt: string;
  tags: string[];
  consent: ConsentStatus;
  lastInteractionAt: string;
}

export type MessageStatus =
  | "agendada"
  | "enviada"
  | "entregue"
  | "lida"
  | "falhou"
  | "cancelada";

export interface Message {
  id: string;
  customer: string;
  channel: Channel;
  automation: string;
  template: string;
  status: MessageStatus;
  sentAt: string;
  deliveredAt: string | null;
  errorReason: string | null;
  orderNumber: string | null;
}

export type TemplateApproval = "aprovado" | "em_analise" | "reprovado" | "rascunho";

export interface WhatsappTemplate {
  id: string;
  name: string;
  category: string;
  language: string;
  approval: TemplateApproval;
  content: string;
  variables: string[];
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  status: TemplateApproval;
  updatedAt: string;
}

export type IntegrationStatus = "conectado" | "desconectado" | "atencao";

export interface Integration {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  lastSyncAt: string;
  error?: string;
}

export interface MetricPoint {
  label: string;
  whatsapp: number;
  email: number;
}

export interface RevenuePoint {
  label: string;
  receita: number;
}

export interface ChannelSummary {
  channel: Channel;
  sent: number;
  delivered: number;
  failed: number;
  readRate: number;
}

export interface ExecutionLog {
  id: string;
  automation: string;
  customer: string;
  channel: Channel;
  status: MessageStatus;
  at: string;
}

export interface DashboardMetrics {
  activeAutomations: number;
  messagesSent: number;
  messagesDelivered: number;
  messagesFailed: number;
  cartsRecovered: number;
  recoveredRevenue: number;
  ordersTracked: number;
  contactsReached: number;
  whatsappConnected: boolean;
  emailConnected: boolean;
  messagesSeries: MetricPoint[];
  revenueSeries: RevenuePoint[];
  channels: ChannelSummary[];
  executions: ExecutionLog[];
  attention: Automation[];
}

export * from "./flow";
export type {
  Flow as AutomationFlow,
  Step as AutomationStep,
  Condition as AutomationCondition,
} from "./flow";
export * from "./filters";
export * from "./connections";
