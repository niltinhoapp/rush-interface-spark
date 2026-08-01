import { FilterTabs } from "@/components/common/FilterTabs";
import { PeriodSelector } from "@/components/common/PeriodSelector";
import { consentLabels } from "@/lib/labels";
import type { ConsentStatus, ContactFilters, PeriodFilter } from "@/types";

const TAGS = ["VIP", "Recorrente", "Skincare", "Novo cliente", "Carrinho recuperado", "Lead"];

export function ContactsFilterControls({
  filters,
  onChangeConsent,
  onChangeCustomerType,
  onChangeTag,
  onChangePeriod,
}: {
  filters: ContactFilters;
  onChangeConsent: (v: ConsentStatus | undefined) => void;
  onChangeCustomerType: (v: "novo" | "recorrente" | undefined) => void;
  onChangeTag: (v: string | undefined) => void;
  onChangePeriod: (v: PeriodFilter) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Última compra
        </p>
        <PeriodSelector value={filters.period ?? { preset: "30d" }} onChange={onChangePeriod} />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Consentimento
        </p>
        <FilterTabs
          options={[
            { value: "", label: "Todos" },
            ...(Object.keys(consentLabels) as ConsentStatus[]).map((v) => ({
              value: v,
              label: consentLabels[v],
            })),
          ]}
          value={filters.consent ?? ""}
          onChange={(v) => onChangeConsent(v ? (v as ConsentStatus) : undefined)}
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Perfil do cliente
        </p>
        <FilterTabs
          options={[
            { value: "", label: "Todos" },
            { value: "novo", label: "Novo" },
            { value: "recorrente", label: "Recorrente" },
          ]}
          value={filters.customerType ?? ""}
          onChange={(v) => onChangeCustomerType(v ? (v as "novo" | "recorrente") : undefined)}
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tag</p>
        <FilterTabs
          options={[{ value: "", label: "Todas" }, ...TAGS.map((t) => ({ value: t, label: t }))]}
          value={filters.tag ?? ""}
          onChange={(v) => onChangeTag(v || undefined)}
        />
      </div>
    </div>
  );
}
