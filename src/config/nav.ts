import { LayoutDashboard, ShoppingBag, FileText, Users, Settings } from "lucide-react"

export const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pesanan",
    href: "/orders",
    icon: ShoppingBag,
  },
  {
    title: "Menu",
    href: "/products",
    icon: FileText,
  },
  {
    title: "Pelanggan",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Pengaturan",
    href: "/settings",
    icon: Settings,
  },
]
