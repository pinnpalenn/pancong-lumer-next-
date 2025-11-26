import Link from "next/link"
import { CartSheet } from "./CartSheet"

export function CustomerNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          Pancong Lumer
        </Link>
        <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6 text-sm font-medium">
                <Link href="/menu" className="hover:text-primary transition-colors">Menu</Link>
                <Link href="/login" className="hover:text-primary transition-colors">Admin</Link>
            </nav>
            <CartSheet />
        </div>
      </div>
    </header>
  )
}
