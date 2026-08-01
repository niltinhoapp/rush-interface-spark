/** Estados de conexão dos canais — somente representação visual. */

export type WhatsappConnectionStatus =
  | "nao_conectado"
  | "conectando"
  | "conectado"
  | "atencao"
  | "erro";

export interface WhatsappConnection {
  status: WhatsappConnectionStatus;
  phone: string | null;
  businessName: string | null;
  /** Identificadores mascarados na UI. */
  wabaId: string | null;
  phoneNumberId: string | null;
  quality: "alta" | "media" | "baixa" | null;
  messagingLimit: string | null;
  accountStatus: string | null;
  lastSyncAt: string | null;
  warnings: string[];
  error?: string | null;
}

export type EmailConnectionStatus = "desconectado" | "conectado" | "erro" | "incompleto";

export interface EmailConnection {
  status: EmailConnectionStatus;
  senderName: string | null;
  senderEmail: string | null;
  replyTo: string | null;
  provider: string | null;
  domain: string | null;
  domainVerified: boolean;
  spf: "verificado" | "pendente" | "falhou";
  dkim: "verificado" | "pendente" | "falhou";
  lastSyncAt: string | null;
  stats: { label: string; value: string }[];
  warnings: string[];
  error?: string | null;
}

export interface IntegrationTestResult {
  ok: boolean;
  message: string;
  checkedAt: string;
}

export interface EmailSender {
  id: string;
  name: string;
  email: string;
  verified: boolean;
}
