import { LayoutDashboard, ShoppingBag, FileText, Users, Settings } from "lucide-react"

export const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pesanan",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "Menu",
    href: "/dashboard/products",
    icon: FileText,
  },
  {
    title: "Pelanggan",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Pengaturan",
    href: "/dashboard/settings",
    icon: Settings,
  },
]
