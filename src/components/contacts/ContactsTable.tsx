import { AppLink } from "@/components/common/AppLink";
import { AsyncSection, SkeletonRows } from "@/components/common/AsyncSection";
import { StatusBadge, statusTones } from "@/components/common/StatusBadge";
import { consentLabels } from "@/lib/labels";
import { formatCurrency, formatDate, orNotProvided } from "@/lib/format";
import { maskEmail, maskPhone } from "@/lib/mask";
import type { Contact } from "@/types";

export function ContactsTable({
  contacts,
  loading,
  error,
  isEmpty,
  onRetry,
  onSelect,
}: {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  onRetry: () => void;
  onSelect: (contact: Contact) => void;
}) {
  return (
    <AsyncSection
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={isEmpty}
      emptyTitle="Nenhum contato encontrado"
      emptyDescription="Ajuste a busca ou os filtros para ver outros contatos."
      skeleton={<SkeletonRows rows={6} />}
    >
      <div className="hidden w-full overflow-x-auto md:block">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Nome", "Contato", "Pedidos", "Total gasto", "Última compra", "Tags", "Consentimento", "Ações"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50">
                <td className="px-4 py-3.5 font-medium">{contact.name}</td>
                <td className="px-4 py-3.5 text-muted-foreground">
                  <p>{maskEmail(contact.email)}</p>
                  <p className="text-xs">{maskPhone(contact.phone)}</p>
                </td>
                <td className="px-4 py-3.5 tabular-nums">{contact.orders}</td>
                <td className="px-4 py-3.5 tabular-nums">{formatCurrency(contact.totalSpent)}</td>
                <td className="px-4 py-3.5 text-muted-foreground">
                  {orNotProvided(formatDate(contact.lastPurchaseAt))}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {contact.tags.map((t) => (
                      <span key={t} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge label={consentLabels[contact.consent]} tone={statusTones[contact.consent]} />
                </td>
                <td className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => onSelect(contact)}
                    className="inline-flex min-h-9 items-center rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Ver detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contacts.length > 0 ? (
        <div className="grid gap-3 p-4 md:hidden">
          {contacts.map((contact) => (
            <article key={contact.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{contact.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{maskEmail(contact.email)}</p>
                </div>
                <StatusBadge label={consentLabels[contact.consent]} tone={statusTones[contact.consent]} />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <dt className="uppercase tracking-wider">Pedidos</dt>
                  <dd className="mt-0.5">{contact.orders}</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-wider">Total gasto</dt>
                  <dd className="mt-0.5">{formatCurrency(contact.totalSpent)}</dd>
                </div>
              </dl>
              <AppLink
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(contact);
                }}
                className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Ver detalhes
              </AppLink>
            </article>
          ))}
        </div>
      ) : null}
    </AsyncSection>
  );
}
