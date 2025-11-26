import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CustomerNavbar } from "@/components/customer/CustomerNavbar"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <CustomerNavbar />
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary">
              Pancong Lumer
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Rasakan sensasi kue pancong tradisional dengan sentuhan modern yang lumer di mulut. 
              Dibuat dengan bahan premium, harga bersahabat.
            </p>
          </div>
          <div className="space-y-4">
            <Link href="/menu">
              <Button size="lg" className="h-12 px-8 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all">
                Pesan Sekarang 😋
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          © 2024 Pancong Lumer. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
