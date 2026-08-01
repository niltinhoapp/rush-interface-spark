/** Filtros, paginação e período — contratos compartilhados com o backend futuro. */
import type {
  AutomationCategory,
  AutomationStatus,
  CartRecoveryStatus,
  Channel,
  ConsentStatus,
  MessageStatus,
  PaymentStatus,
  ShippingStatus,
} from "./index";

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type PeriodPreset = "hoje" | "7d" | "30d" | "custom";

export interface PeriodFilter {
  preset: PeriodPreset;
  /** ISO date (YYYY-MM-DD) — obrigatório apenas em `custom`. */
  from?: string;
  to?: string;
}

export interface BaseFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  period?: PeriodFilter;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface AutomationFilters extends BaseFilters {
  status?: AutomationStatus;
  channel?: Channel;
  category?: AutomationCategory;
}

export interface OrderFilters extends BaseFilters {
  payment?: PaymentStatus;
  shipping?: ShippingStatus;
  automation?: string;
}

export interface CartFilters extends BaseFilters {
  status?: CartRecoveryStatus;
  channel?: Channel;
}

export interface ContactFilters extends BaseFilters {
  consent?: ConsentStatus;
  customerType?: "novo" | "recorrente";
  tag?: string;
}

export interface MessageFilters extends BaseFilters {
  channel?: Channel;
  status?: MessageStatus;
  automation?: string;
  orderNumber?: string;
}
