import { getDashboardStats } from "@/server/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingBag, TrendingUp, AlertCircle } from "lucide-react"

// Format Rupiah Helper
const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number)
}

export default async function DashboardPage() {
  // 1. Ambil data langsung dari database (Server Component)
  const stats = await getDashboardStats()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard Ringkasan</h1>
        <span className="text-sm text-muted-foreground">
          Tanggal: {stats.date}
        </span>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatRupiah(stats.total_sales)}
            </div>
            <p className="text-xs text-muted-foreground">Penjualan hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_orders}</div>
            <p className="text-xs text-muted-foreground">Order masuk hari ini</p>
          </CardContent>
        </Card>
      </div>

      {/* --- MENU PERFORMANCE --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Menu Laku */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Menu Paling Laku
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.menu_laku.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada data penjualan.</p>
              ) : (
                stats.menu_laku.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="font-medium">{item.nama}</div>
                    <div className="text-sm text-muted-foreground">{item.jumlah} terjual</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Menu Belum Laku (Evaluasi) */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Perlu Evaluasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">Menu belum terjual hari ini:</p>
              <div className="flex flex-wrap gap-2">
                {stats.menu_belum_laku.map((item: any, i: number) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10"
                  >
                    {item.nama}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
