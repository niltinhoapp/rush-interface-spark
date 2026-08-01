import { paymentLabels, shippingLabels } from "@/lib/labels";
import { FilterTabs } from "@/components/common/FilterTabs";
import { PeriodSelector } from "@/components/common/PeriodSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderFilters, PaymentStatus, PeriodFilter, ShippingStatus } from "@/types";

export interface OrdersFilterControlsProps {
  filters: OrderFilters;
  automationOptions: string[];
  onChangePayment: (value: PaymentStatus | undefined) => void;
  onChangeShipping: (value: ShippingStatus | undefined) => void;
  onChangeAutomation: (value: string | undefined) => void;
  onChangePeriod: (value: PeriodFilter) => void;
}

const paymentTabs = (Object.keys(paymentLabels) as PaymentStatus[]).map((value) => ({
  value,
  label: paymentLabels[value],
}));

const shippingTabs = (Object.keys(shippingLabels) as ShippingStatus[]).map((value) => ({
  value,
  label: shippingLabels[value],
}));

export function OrdersFilterControls({
  filters,
  automationOptions,
  onChangePayment,
  onChangeShipping,
  onChangeAutomation,
  onChangePeriod,
}: OrdersFilterControlsProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Período
        </p>
        <PeriodSelector
          value={filters.period ?? { preset: "30d" }}
          onChange={onChangePeriod}
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pagamento
        </p>
        <FilterTabs
          options={[{ value: "", label: "Todos" }, ...paymentTabs]}
          value={filters.payment ?? ""}
          onChange={(v) => onChangePayment(v ? (v as PaymentStatus) : undefined)}
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Envio
        </p>
        <FilterTabs
          options={[{ value: "", label: "Todos" }, ...shippingTabs]}
          value={filters.shipping ?? ""}
          onChange={(v) => onChangeShipping(v ? (v as ShippingStatus) : undefined)}
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Automação
        </p>
        <Select
          value={filters.automation ?? "todas"}
          onValueChange={(v) => onChangeAutomation(v === "todas" ? undefined : v)}
        >
          <SelectTrigger aria-label="Filtrar por automação" className="min-h-11 bg-card">
            <SelectValue placeholder="Todas as automações" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as automações</SelectItem>
            {automationOptions.map((automation) => (
              <SelectItem key={automation} value={automation}>
                {automation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
