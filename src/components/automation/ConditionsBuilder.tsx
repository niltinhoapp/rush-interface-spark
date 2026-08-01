import { Plus, Trash2 } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { Field, fieldInputClass } from "@/components/common/Field";
import { Button } from "@/components/ui/button";
import { conditionFieldLabels, conditionOperatorLabels } from "@/lib/labels";
import { createCondition, isNumericField } from "@/features/automations/lib/flow";
import type {
  AutomationCondition,
  AutomationConditionField,
  AutomationConditionOperator,
  ConditionMatch,
  FlowErrors,
} from "@/types/automation-flow";
import { cn } from "@/lib/utils";

export function ConditionsBuilder({
  conditions,
  match,
  onChange,
  onMatchChange,
  errors,
}: {
  conditions: AutomationCondition[];
  match: ConditionMatch;
  onChange: (conditions: AutomationCondition[]) => void;
  onMatchChange: (match: ConditionMatch) => void;
  errors: FlowErrors;
}) {
  const update = (id: string, patch: Partial<AutomationCondition>) =>
    onChange(conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  return (
    <SectionCard
      title="2. Condições"
      description="Opcional. Restrinja quando a automação deve rodar."
      actions={
        <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
          {(["all", "any"] as ConditionMatch[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={match === option}
              onClick={() => onMatchChange(option)}
              className={cn(
                "min-h-9 rounded-lg px-3 text-xs transition-colors",
                match === option
                  ? "bg-primary/15 font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option === "all" ? "Todas as condições" : "Qualquer condição"}
            </button>
          ))}
        </div>
      }
      bodyClassName="space-y-3"
    >
      {conditions.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          Nenhuma condição — a automação roda para todos os eventos do gatilho.
        </p>
      ) : null}

      {conditions.map((condition, index) => {
        const errorKey = `cond:${condition.id}:value`;
        return (
          <div
            key={condition.id}
            className="grid gap-3 rounded-xl border border-border bg-card p-3 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-start"
          >
            <Field id={`${condition.id}-field`} label={index === 0 ? "Campo" : "E / Ou — campo"}>
              {(props) => (
                <select
                  {...props}
                  value={condition.field}
                  onChange={(e) =>
                    update(condition.id, {
                      field: e.target.value as AutomationConditionField,
                      value: "",
                    })
                  }
                  className={fieldInputClass}
                >
                  {Object.entries(conditionFieldLabels).map(([field, label]) => (
                    <option key={field} value={field}>
                      {label}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <Field id={`${condition.id}-operator`} label="Operador">
              {(props) => (
                <select
                  {...props}
                  value={condition.operator}
                  onChange={(e) =>
                    update(condition.id, {
                      operator: e.target.value as AutomationConditionOperator,
                    })
                  }
                  className={fieldInputClass}
                >
                  {Object.entries(conditionOperatorLabels).map(([operator, label]) => (
                    <option key={operator} value={operator}>
                      {label}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <Field id={`${condition.id}-value`} label="Valor" error={errors[errorKey]}>
              {(props) => (
                <input
                  {...props}
                  type={isNumericField(condition.field) ? "number" : "text"}
                  value={String(condition.value ?? "")}
                  placeholder={
                    condition.operator === "in" || condition.operator === "not_in"
                      ? "Separe por vírgula"
                      : "Informe o valor"
                  }
                  onChange={(e) => update(condition.id, { value: e.target.value })}
                  className={fieldInputClass}
                />
              )}
            </Field>

            <div className="lg:pt-6">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remover condição ${index + 1}`}
                onClick={() => onChange(conditions.filter((c) => c.id !== condition.id))}
                className="min-h-11 min-w-11 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...conditions, createCondition()])}
        className="min-h-11"
      >
        <Plus className="size-4" />
        Adicionar condição
      </Button>
    </SectionCard>
  );
}
