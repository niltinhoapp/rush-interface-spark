import { Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";
import type { OrderEvent } from "@/types";

const toneClasses = {
  info: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  error: "bg-destructive/15 text-destructive",
} as const;

export function Timeline({ events }: { events: OrderEvent[] }) {
  return (
    <ol className="relative space-y-5 pl-6">
      <span aria-hidden className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
      {events.map((event) => {
        const Icon = event.channel === "email" ? Mail : MessageCircle;
        return (
          <li key={event.id} className="relative">
            <span
              className={cn(
                "absolute -left-6 top-0.5 flex size-6 items-center justify-center rounded-full",
                toneClasses[event.tone],
              )}
            >
              {event.channel ? <Icon className="size-3" /> : <span className="size-1.5 rounded-full bg-current" />}
            </span>
            <p className="text-sm font-medium">{event.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{event.description}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
              {formatDateTime(event.at)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
