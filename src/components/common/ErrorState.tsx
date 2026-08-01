import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "Não foi possível carregar",
  description,
  onRetry,
}: {
  title?: string;
  description?: string | null;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center"
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
        <AlertTriangle className="size-5" />
      </span>
      <div>
        <p className="font-display text-base font-semibold">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          {description || "Ocorreu um erro inesperado ao buscar os dados."}
        </p>
      </div>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry} className="min-h-11">
          <RotateCw className="size-4" />
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
