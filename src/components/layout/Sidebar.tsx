import Link from "next/link"
import { NavItems } from "./NavItems"

export function Sidebar() {
  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-primary text-xl font-bold">Pancong Lumer</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2 px-4">
          <NavItems />
        </div>
      </div>
    </aside>
  )
}
