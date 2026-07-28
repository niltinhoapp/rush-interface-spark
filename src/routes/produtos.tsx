import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { products } from "@/data/mock";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos — Nuvem Rush" },
      {
        name: "description",
        content: "Catálogo com estoque, vendas, preço e margem de cada produto da loja.",
      },
      { property: "og:title", content: "Produtos — Nuvem Rush" },
      {
        property: "og:description",
        content: "Estoque, vendas, preço e margem por produto.",
      },
    ],
  }),
  component: Produtos,
});

function Produtos() {
  return (
    <DashboardLayout title="Produtos" subtitle="Catálogo sincronizado · 5 SKUs monitorados">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((p) => {
          const low = p.stock < 40;
          return (
            <article key={p.id} className="surface-panel rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold">{p.name}</h2>
                  <p className="text-xs text-muted-foreground">SKU {p.sku}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    low ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
                  }`}
                >
                  {low ? "Estoque baixo" : "Saudável"}
                </span>
              </div>
              <p className="mt-4 font-display text-2xl font-semibold">{p.price}</p>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Estoque</dt>
                  <dd className="mt-1 font-medium">{p.stock}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Vendidos</dt>
                  <dd className="mt-1 font-medium">{p.sold}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Margem</dt>
                  <dd className="mt-1 font-medium">{p.margin}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
