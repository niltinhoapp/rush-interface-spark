export type Trend = "up" | "down";

export const kpis = [
  { label: "Faturamento", value: "R$ 184.320", delta: "+18,4%", trend: "up" as Trend, hint: "vs. período anterior" },
  { label: "Investimento em Ads", value: "R$ 42.870", delta: "+6,1%", trend: "up" as Trend, hint: "Meta Ads" },
  { label: "ROAS", value: "4,30x", delta: "+0,42", trend: "up" as Trend, hint: "meta: 3,50x" },
  { label: "Pedidos", value: "1.284", delta: "-2,8%", trend: "down" as Trend, hint: "ticket médio R$ 143" },
];

export const revenueSeries = [
  { day: "01", receita: 9800, investimento: 2400 },
  { day: "04", receita: 12400, investimento: 3100 },
  { day: "07", receita: 11200, investimento: 2900 },
  { day: "10", receita: 16800, investimento: 3800 },
  { day: "13", receita: 15200, investimento: 3600 },
  { day: "16", receita: 21400, investimento: 4700 },
  { day: "19", receita: 19800, investimento: 4300 },
  { day: "22", receita: 24600, investimento: 5100 },
  { day: "25", receita: 27300, investimento: 5600 },
  { day: "28", receita: 25820, investimento: 5370 },
];

export const channelSplit = [
  { name: "Meta Ads", value: 58 },
  { name: "Orgânico", value: 21 },
  { name: "E-mail", value: 12 },
  { name: "Direto", value: 9 },
];

export const campaigns = [
  {
    id: "cmp-1",
    name: "Black Rush — Advantage+",
    objective: "Vendas",
    status: "Ativa",
    spend: "R$ 12.480",
    revenue: "R$ 61.200",
    roas: 4.9,
    ctr: "2,4%",
  },
  {
    id: "cmp-2",
    name: "Retargeting 7d — Carrinho",
    objective: "Conversão",
    status: "Ativa",
    spend: "R$ 6.210",
    revenue: "R$ 38.400",
    roas: 6.2,
    ctr: "3,1%",
  },
  {
    id: "cmp-3",
    name: "Prospecção Lookalike 1%",
    objective: "Vendas",
    status: "Aprendizado",
    spend: "R$ 9.740",
    revenue: "R$ 27.100",
    roas: 2.8,
    ctr: "1,7%",
  },
  {
    id: "cmp-4",
    name: "Catálogo Dinâmico — Full",
    objective: "Catálogo",
    status: "Pausada",
    spend: "R$ 4.320",
    revenue: "R$ 9.860",
    roas: 2.3,
    ctr: "1,2%",
  },
  {
    id: "cmp-5",
    name: "Teste Criativo — UGC 04",
    objective: "Tráfego",
    status: "Ativa",
    spend: "R$ 2.180",
    revenue: "R$ 7.940",
    roas: 3.6,
    ctr: "2,9%",
  },
];

export const products = [
  { id: "p1", name: "Tênis Rush Air 2.0", sku: "NR-1042", stock: 128, sold: 312, price: "R$ 349,90", margin: "42%" },
  { id: "p2", name: "Jaqueta Corta-Vento Nimbus", sku: "NR-2087", stock: 34, sold: 187, price: "R$ 289,00", margin: "38%" },
  { id: "p3", name: "Camiseta Dry Cloud", sku: "NR-3311", stock: 402, sold: 521, price: "R$ 119,90", margin: "56%" },
  { id: "p4", name: "Mochila Trail 28L", sku: "NR-4120", stock: 12, sold: 96, price: "R$ 459,00", margin: "31%" },
  { id: "p5", name: "Meia Performance (kit 3)", sku: "NR-5560", stock: 780, sold: 644, price: "R$ 79,90", margin: "61%" },
];

export const creatives = [
  { id: "c1", name: "UGC — Depoimento Ana", format: "Reels 9:16", ctr: "3,4%", cpa: "R$ 21,40", score: 92 },
  { id: "c2", name: "Estático — Oferta 40%", format: "Feed 1:1", ctr: "2,1%", cpa: "R$ 33,80", score: 74 },
  { id: "c3", name: "Carrossel — Coleção Nimbus", format: "Carrossel", ctr: "1,8%", cpa: "R$ 39,10", score: 63 },
  { id: "c4", name: "Vídeo — Unboxing Rush Air", format: "Reels 9:16", ctr: "2,9%", cpa: "R$ 24,90", score: 85 },
];

export const alerts = [
  { id: "a1", tone: "warning" as const, title: "Estoque crítico", body: "Mochila Trail 28L com 12 unidades e 96 vendas no período." },
  { id: "a2", tone: "success" as const, title: "ROAS acima da meta", body: "Retargeting 7d atingiu 6,2x nas últimas 48h." },
  { id: "a3", tone: "muted" as const, title: "Criativo em fadiga", body: "Carrossel Nimbus caiu 28% de CTR em 5 dias." },
];
