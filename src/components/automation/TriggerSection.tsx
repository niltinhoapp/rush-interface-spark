import { SectionCard } from "@/components/common/SectionCard";
import { Field, fieldInputClass } from "@/components/common/Field";
import { timeUnitLabels, triggerLabels, triggersWithOffset } from "@/lib/labels";
import type { AutomationTrigger } from "@/types";
import type { Trigger, FlowErrors, TimeUnit } from "@/types/flow";
import { cn } from "@/lib/utils";

const triggerOrder: AutomationTrigger[] = [
  "pedido_criado",
  "pedido_pago",
  "pedido_enviado",
  "pedido_cancelado",
  "carrinho_abandonado",
  "pos_compra",
  "recompra",
];

export function TriggerSection({
  value,
  onChange,
  errors,
}: {
  value: Trigger;
  onChange: (value: Trigger) => void;
  errors: FlowErrors;
}) {
  const needsOffset = triggersWithOffset.includes(value.type);

  return (
    <SectionCard
      title="1. Gatilho"
      description="Evento da loja que inicia a automação."
      bodyClassName="space-y-4"
    >
      <div role="radiogroup" aria-label="Gatilho" className="grid gap-2 sm:grid-cols-2">
        {triggerOrder.map((trigger) => {
          const active = value.type === trigger;
          return (
            <button
              key={trigger}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() =>
                onChange({
                  type: trigger,
                  offsetAmount: triggersWithOffset.includes(trigger)
                    ? (value.offsetAmount ?? 30)
                    : undefined,
                  offsetUnit: triggersWithOffset.includes(trigger)
                    ? (value.offsetUnit ?? "dias")
                    : undefined,
                })
              }
              className={cn(
                "flex min-h-11 items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition-colors",
                active
                  ? "border-primary/50 bg-primary/10 font-medium text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              <span>{triggerLabels[trigger]}</span>
              <span
                aria-hidden
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  active ? "bg-primary" : "bg-border",
                )}
              />
            </button>
          );
        })}
      </div>

      {errors.trigger ? (
        <p role="alert" className="text-xs font-medium text-destructive">
          {errors.trigger}
        </p>
      ) : null}

      {needsOffset ? (
        <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[140px_180px]">
          <Field id="trigger-offset" label="Quantidade" error={errors.triggerOffset}>
            {(props) => (
              <input
                {...props}
                type="number"
                min={1}
                value={value.offsetAmount ?? ""}
                onChange={(e) => onChange({ ...value, offsetAmount: Number(e.target.value) })}
                className={fieldInputClass}
              />
            )}
          </Field>
          <Field id="trigger-unit" label="Unidade">
            {(props) => (
              <select
                {...props}
                value={value.offsetUnit ?? "dias"}
                onChange={(e) => onChange({ ...value, offsetUnit: e.target.value as TimeUnit })}
                className={fieldInputClass}
              >
                {Object.entries(timeUnitLabels).map(([unit, label]) => (
                  <option key={unit} value={unit}>
                    {label}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Exemplo: {value.offsetAmount ?? 30}{" "}
            {timeUnitLabels[value.offsetUnit ?? "dias"].toLowerCase()} após a compra.
          </p>
        </div>
      ) : null}
    </SectionCard>
  );
}
