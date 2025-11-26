import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <DashboardLayout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard Penjualan</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Selamat Datang Admin
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sistem Pancong Lumer v2.0 (Next.js) siap digunakan.
          </p>
          <Button>Buat Pesanan Baru</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
