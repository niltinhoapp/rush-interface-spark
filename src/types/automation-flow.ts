/**
 * @deprecated Use `@/types/flow` — modelo oficial (Flow, Trigger, Condition, Step, ActionType).
 * Este arquivo mantém apelidos de compatibilidade para código legado.
 */
export * from "./flow";

export type {
  Flow as AutomationFlow,
  Trigger as AutomationTriggerConfig,
  Condition as AutomationCondition,
  ConditionField as AutomationConditionField,
  ConditionOperator as AutomationConditionOperator,
  ConditionValue as AutomationConditionValue,
  Step as AutomationStep,
  ActionType as AutomationStepKind,
} from "./flow";
