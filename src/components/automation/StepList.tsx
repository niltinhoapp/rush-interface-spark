import {
  ArrowDown,
  ArrowUp,
  Clock,
  Copy,
  Mail,
  MessageCircle,
  Plus,
  Tag,
  Trash2,
  Webhook,
} from "lucide-react";
import type { ComponentType } from "react";
import { SectionCard } from "@/components/common/SectionCard";
import { Field, fieldInputClass } from "@/components/common/Field";
import { Button } from "@/components/ui/button";
import { actionTypeLabels, timeUnitLabels, webhookMethods } from "@/lib/labels";
import { createStep, duplicateStep, moveStep, nextId } from "@/features/automations/lib/flow";
import type {
  Step,
  ActionType,
  FlowErrors,
  TimeUnit,
  WebhookMethod,
} from "@/types/flow";
import type { EmailSender } from "@/types/connections";
import type { EmailTemplate, WhatsappTemplate } from "@/types";
import { cn } from "@/lib/utils";

const stepIcons: Record<ActionType, ComponentType<{ className?: string }>> = {
  delay: Clock,
  whatsapp: MessageCircle,
  email: Mail,
  tag: Tag,
  webhook: Webhook,
};

interface StepListProps {
  steps: Step[];
  onChange: (steps: Step[]) => void;
  errors: FlowErrors;
  whatsappTemplates: WhatsappTemplate[];
  emailTemplates: EmailTemplate[];
  senders: EmailSender[];
  loadingResources?: boolean;
}

export function StepList({
  steps,
  onChange,
  errors,
  whatsappTemplates,
  emailTemplates,
  senders,
  loadingResources,
}: StepListProps) {
  const patch = (id: string, value: Partial<Step>) =>
    onChange(steps.map((s) => (s.id === id ? ({ ...s, ...value } as Step) : s)));

  return (
    <SectionCard
      title="3. Ações do fluxo"
      description="Sequência executada quando o gatilho e as condições forem atendidos."
      bodyClassName="space-y-3"
    >
      {errors.steps ? (
        <p role="alert" className="text-xs font-medium text-destructive">
          {errors.steps}
        </p>
      ) : null}

      <ol className="space-y-3">
        {steps.map((step, index) => {
          const Icon = stepIcons[step.type];
          return (
            <li key={step.id} className="rounded-2xl border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {index + 1}. {actionTypeLabels[step.type]}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {step.type === "delay" ? "Espera antes da próxima ação" : "Ação do fluxo"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Mover etapa ${index + 1} para cima`}
                    disabled={index === 0}
                    onClick={() => onChange(moveStep(steps, index, -1))}
                    className="min-h-11 min-w-11"
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Mover etapa ${index + 1} para baixo`}
                    disabled={index === steps.length - 1}
                    onClick={() => onChange(moveStep(steps, index, 1))}
                    className="min-h-11 min-w-11"
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Duplicar etapa ${index + 1}`}
                    onClick={() => {
                      const copy = [...steps];
                      copy.splice(index + 1, 0, duplicateStep(step));
                      onChange(copy);
                    }}
                    className="min-h-11 min-w-11"
                  >
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remover etapa ${index + 1}`}
                    onClick={() => onChange(steps.filter((s) => s.id !== step.id))}
                    className="min-h-11 min-w-11 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <StepEditor
                  step={step}
                  errors={errors}
                  onPatch={(value) => patch(step.id, value)}
                  whatsappTemplates={whatsappTemplates}
                  emailTemplates={emailTemplates}
                  senders={senders}
                  loadingResources={loadingResources}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap gap-2 pt-1">
        {(Object.keys(actionTypeLabels) as ActionType[]).map((kind) => {
          const Icon = stepIcons[kind];
          return (
            <Button
              key={kind}
              type="button"
              variant="outline"
              onClick={() => onChange([...steps, createStep(kind)])}
              className="min-h-11"
            >
              <Plus className="size-3.5" />
              <Icon className="size-3.5" />
              {actionTypeLabels[kind]}
            </Button>
          );
        })}
      </div>
    </SectionCard>
  );
}

function StepEditor({
  step,
  errors,
  onPatch,
  whatsappTemplates,
  emailTemplates,
  senders,
  loadingResources,
}: {
  step: Step;
  errors: FlowErrors;
  onPatch: (value: Partial<Step>) => void;
  whatsappTemplates: WhatsappTemplate[];
  emailTemplates: EmailTemplate[];
  senders: EmailSender[];
  loadingResources?: boolean;
}) {
  const error = (field: string) => errors[`step:${step.id}:${field}`];

  if (step.type === "delay") {
    return (
      <div className="grid gap-3 sm:grid-cols-[140px_180px]">
        <Field id={`${step.id}-amount`} label="Esperar" error={error("amount")}>
          {(props) => (
            <input
              {...props}
              type="number"
              min={1}
              value={step.amount}
              onChange={(e) => onPatch({ amount: Number(e.target.value) })}
              className={fieldInputClass}
            />
          )}
        </Field>
        <Field id={`${step.id}-unit`} label="Unidade">
          {(props) => (
            <select
              {...props}
              value={step.unit}
              onChange={(e) => onPatch({ unit: e.target.value as TimeUnit })}
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
      </div>
    );
  }

  if (step.type === "send_whatsapp") {
    const template = whatsappTemplates.find((t) => t.id === step.templateId);
    return (
      <div className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            id={`${step.id}-template`}
            label="Template aprovado"
            error={error("templateId")}
            hint={loadingResources ? "Carregando templates…" : undefined}
          >
            {(props) => (
              <select
                {...props}
                value={step.templateId}
                onChange={(e) =>
                  onPatch({
                    templateId: e.target.value,
                    language:
                      whatsappTemplates.find((t) => t.id === e.target.value)?.language ?? "pt_BR",
                    variables: {},
                  })
                }
                className={fieldInputClass}
              >
                <option value="">Selecione um template</option>
                {whatsappTemplates
                  .filter((t) => t.approval === "aprovado")
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            )}
          </Field>
          <Field id={`${step.id}-recipient`} label="Destinatário" error={error("recipientField")}>
            {(props) => (
              <input
                {...props}
                value={step.recipientField}
                onChange={(e) => onPatch({ recipientField: e.target.value })}
                className={fieldInputClass}
              />
            )}
          </Field>
        </div>

        {template ? (
          <>
            <VariablesEditor
              stepId={step.id}
              variables={template.variables}
              values={step.variables}
              onChange={(variables) => onPatch({ variables })}
            />
            <MessagePreview text={renderPreview(template.content, step.variables)} />
          </>
        ) : null}
      </div>
    );
  }

  if (step.type === "send_email") {
    const template = emailTemplates.find((t) => t.id === step.templateId);
    return (
      <div className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id={`${step.id}-etemplate`} label="Template" error={error("templateId")}>
            {(props) => (
              <select
                {...props}
                value={step.templateId}
                onChange={(e) => {
                  const found = emailTemplates.find((t) => t.id === e.target.value);
                  onPatch({
                    templateId: e.target.value,
                    subject: found?.subject ?? step.subject,
                    variables: {},
                  });
                }}
                className={fieldInputClass}
              >
                <option value="">Selecione um template</option>
                {emailTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field id={`${step.id}-sender`} label="Remetente" error={error("senderId")}>
            {(props) => (
              <select
                {...props}
                value={step.senderId}
                onChange={(e) => onPatch({ senderId: e.target.value })}
                className={fieldInputClass}
              >
                <option value="">Selecione um remetente</option>
                {senders.map((sender) => (
                  <option key={sender.id} value={sender.id}>
                    {sender.name} · {sender.email}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>

        <Field id={`${step.id}-subject`} label="Assunto" error={error("subject")}>
          {(props) => (
            <input
              {...props}
              value={step.subject}
              onChange={(e) => onPatch({ subject: e.target.value })}
              className={fieldInputClass}
            />
          )}
        </Field>

        {template ? (
          <>
            <VariablesEditor
              stepId={step.id}
              variables={template.variables}
              values={step.variables}
              onChange={(variables) => onPatch({ variables })}
            />
            <MessagePreview text={renderPreview(template.content, step.variables)} />
          </>
        ) : null}
      </div>
    );
  }

  if (step.type === "add_tag") {
    return (
      <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
        <Field id={`${step.id}-tag`} label="Tag do contato" error={error("tag")}>
          {(props) => (
            <input
              {...props}
              value={step.tag}
              placeholder="Ex.: recuperado"
              onChange={(e) => onPatch({ tag: e.target.value })}
              className={fieldInputClass}
            />
          )}
        </Field>
        <Field id={`${step.id}-tag-action`} label="Ação">
          {(props) => (
            <select
              {...props}
              value={step.action}
              onChange={(e) => onPatch({ action: e.target.value as "add" | "remove" })}
              className={fieldInputClass}
            >
              <option value="add">Adicionar tag</option>
              <option value="remove">Remover tag</option>
            </select>
          )}
        </Field>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
        <Field
          id={`${step.id}-url`}
          label="URL do webhook"
          error={error("url")}
          hint="Somente https."
        >
          {(props) => (
            <input
              {...props}
              value={step.url}
              placeholder="https://api.suaempresa.com/hooks/nuvem-rush"
              onChange={(e) => onPatch({ url: e.target.value })}
              className={fieldInputClass}
            />
          )}
        </Field>
        <Field id={`${step.id}-method`} label="Método">
          {(props) => (
            <select
              {...props}
              value={step.method}
              onChange={(e) => onPatch({ method: e.target.value as WebhookMethod })}
              className={fieldInputClass}
            >
              {webhookMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <div className="grid gap-2">
        <p className="text-xs font-medium text-muted-foreground">Cabeçalhos</p>
        {step.headers.map((header, index) => (
          <div key={header.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input
              aria-label={`Chave do cabeçalho ${index + 1}`}
              value={header.key}
              onChange={(e) =>
                onPatch({
                  headers: step.headers.map((h) =>
                    h.id === header.id ? { ...h, key: e.target.value } : h,
                  ),
                })
              }
              className={fieldInputClass}
            />
            <input
              aria-label={`Valor do cabeçalho ${index + 1}`}
              value={header.value}
              onChange={(e) =>
                onPatch({
                  headers: step.headers.map((h) =>
                    h.id === header.id ? { ...h, value: e.target.value } : h,
                  ),
                })
              }
              className={fieldInputClass}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remover cabeçalho ${index + 1}`}
              onClick={() => onPatch({ headers: step.headers.filter((h) => h.id !== header.id) })}
              className="min-h-11 min-w-11 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="min-h-11 justify-self-start"
          onClick={() =>
            onPatch({ headers: [...step.headers, { id: nextId("hdr"), key: "", value: "" }] })
          }
        >
          <Plus className="size-4" />
          Adicionar cabeçalho
        </Button>
      </div>

      <Field id={`${step.id}-body`} label="Corpo (JSON)">
        {(props) => (
          <textarea
            {...props}
            rows={5}
            value={step.body}
            onChange={(e) => onPatch({ body: e.target.value })}
            className={cn(fieldInputClass, "min-h-28 py-2 font-mono text-xs")}
          />
        )}
      </Field>
    </div>
  );
}

function VariablesEditor({
  stepId,
  variables,
  values,
  onChange,
}: {
  stepId: string;
  variables: string[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}) {
  if (variables.length === 0) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {variables.map((variable) => (
        <Field key={variable} id={`${stepId}-var-${variable}`} label={`Variável ${variable}`}>
          {(props) => (
            <input
              {...props}
              value={values[variable] ?? ""}
              placeholder={`{{${variable}}}`}
              onChange={(e) => onChange({ ...values, [variable]: e.target.value })}
              className={fieldInputClass}
            />
          )}
        </Field>
      ))}
    </div>
  );
}

function renderPreview(content: string, values: Record<string, string>) {
  return content.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => values[key] || match);
}

function MessagePreview({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Pré-visualização
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{text}</p>
    </div>
  );
}
