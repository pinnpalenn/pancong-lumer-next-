import { getDashboardStats, getSalesChartData } from "@/server/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewChart } from "@/components/dashboard/OverviewChart"
import { DollarSign, ShoppingBag, TrendingUp, AlertCircle } from "lucide-react"

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number)
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const chartData = await getSalesChartData()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard Ringkasan</h1>
        <span className="text-sm text-muted-foreground">
          Tanggal: {stats.date}
        </span>
      </div>

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* CHART SECTION */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Grafik Penjualan (7 Hari Terakhir)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={chartData} />
          </CardContent>
        </Card>

        {/* MENU PERFORMANCE (Dari kode Anda sebelumnya) */}
        <Card className="col-span-3">
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
                stats.menu_laku.slice(0, 5).map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="font-medium text-sm">{item.nama}</div>
                    <div className="text-sm text-primary font-bold">{item.jumlah} terjual</div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" /> Perlu Evaluasi
                </h4>
                <div className="flex flex-wrap gap-2">
                    {stats.menu_belum_laku.slice(0, 6).map((item: any, i: number) => (
                    <span key={i} className="text-[10px] bg-muted px-2 py-1 rounded-full">
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
