import {
  Boxes,
  Contact2,
  LayoutDashboard,
  Mail,
  MessageCircle,
  MessagesSquare,
  Plug,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Workflow,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Operação",
    items: [
      { title: "Visão geral", url: "/", icon: LayoutDashboard },
      { title: "Automações", url: "/automacoes", icon: Workflow },
      { title: "Carrinhos", url: "/carrinhos", icon: ShoppingCart },
      { title: "Pedidos", url: "/pedidos", icon: ShoppingBag },
    ],
  },
  {
    label: "Relacionamento",
    items: [
      { title: "Contatos", url: "/contatos", icon: Contact2 },
      { title: "Mensagens", url: "/mensagens", icon: MessagesSquare },
      { title: "Templates", url: "/templates", icon: FileText },
    ],
  },
  {
    label: "Canais",
    items: [
      { title: "WhatsApp", url: "/whatsapp", icon: MessageCircle },
      { title: "E-mail", url: "/email", icon: Mail },
      { title: "Integrações", url: "/integracoes", icon: Plug },
      { title: "Configurações", url: "/configuracoes", icon: Settings },
    ],
  },
];

export const brandIcon = Boxes;
