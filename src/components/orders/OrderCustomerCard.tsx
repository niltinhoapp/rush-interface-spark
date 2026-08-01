import { SectionCard } from "@/components/common/SectionCard";
import { maskEmail, maskPhone } from "@/lib/mask";
import { orNotProvided } from "@/lib/format";
import type { Order } from "@/types";

export function OrderCustomerCard({ order }: { order: Order }) {
  return (
    <SectionCard title="Cliente" bodyClassName="space-y-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">Nome</span>
        <span className="font-medium">{order.customer}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">E-mail</span>
        <span className="font-medium">{order.customerEmail ? maskEmail(order.customerEmail) : orNotProvided(null)}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">Telefone</span>
        <span className="font-medium">{order.customerPhone ? maskPhone(order.customerPhone) : orNotProvided(null)}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">Endereço de entrega</span>
        <span className="max-w-[60%] truncate text-right font-medium">
          {orNotProvided(order.shippingAddress)}
        </span>
      </div>
    </SectionCard>
  );
}
