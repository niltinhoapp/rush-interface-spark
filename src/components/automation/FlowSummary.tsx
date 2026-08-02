import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { conditionFieldLabels, conditionOperatorLabels, triggerLabels } from "@/lib/labels";
import { describeFlow } from "@/features/automations/lib/flow";
import type { Flow } from "@/types/flow";

/** Resumo lateral do fluxo, sempre visível durante a edição. */
export function FlowSummary({ flow, invalid }: { flow: Flow; invalid: number }) {
  const steps = describeFlow(flow);

  return (
    <SectionCard title="Resumo do fluxo" bodyClassName="space-y-4 text-sm">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Quando
        </p>
        <p className="mt-1">
          {triggerLabels[flow.trigger.type]}
          {flow.trigger.offsetAmount
            ? ` · ${flow.trigger.offsetAmount} ${flow.trigger.offsetUnit}`
            : ""}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Se {flow.conditionMatch === "all" ? "todas" : "qualquer"}
        </p>
        {flow.conditions.length === 0 ? (
          <p className="mt-1 text-muted-foreground">Sem condições</p>
        ) : (
          <ul className="mt-1 space-y-1">
            {flow.conditions.map((condition) => (
              <li key={condition.id} className="text-muted-foreground">
                {conditionFieldLabels[condition.field]}{" "}
                {conditionOperatorLabels[condition.operator].toLowerCase()}{" "}
                <span className="text-foreground">{String(condition.value) || "—"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Então
        </p>
        <ol className="mt-1 space-y-1">
          {steps.map((label, index) => (
            <li key={`${label}-${index}`} className="flex gap-2 text-muted-foreground">
              <span className="tabular-nums text-foreground">{index + 1}.</span>
              {label}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-muted-foreground">Validação</span>
        <StatusBadge
          label={invalid === 0 ? "Pronto para salvar" : `${invalid} pendência(s)`}
          tone={invalid === 0 ? "success" : "warning"}
        />
      </div>
    </SectionCard>
  );
}
