import { getOrdersHistory } from "@/server/data"
import { updateOrderStatus } from "@/server/actions"
import { revalidatePath } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function OrdersPage() {
  const orders = await getOrdersHistory()

  const handleStatusUpdate = async (formData: FormData) => {
    "use server"
    const id = formData.get("id") as string
    const status = formData.get("status") as any
    await updateOrderStatus(id, status)
    revalidatePath("/dashboard/orders")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500"
      case "PROCESSING": return "bg-blue-500"
      case "COMPLETED": return "bg-green-500"
      case "CANCELLED": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Manajemen Pesanan</h1>
      <Card>
        <CardHeader><CardTitle>Riwayat Pesanan Masuk</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Menu</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(-6)}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <ul className="text-xs list-disc list-inside text-muted-foreground">
                        {order.items.map(item => (
                            <li key={item.id}>{item.product.name} (x{item.quantity})</li>
                        ))}
                    </ul>
                  </TableCell>
                  <TableCell>Rp {Number(order.totalAmount).toLocaleString('id-ID')}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                        {order.status === 'PENDING' && (
                            <form action={handleStatusUpdate}>
                                <input type="hidden" name="id" value={order.id} />
                                <input type="hidden" name="status" value="PROCESSING" />
                                <Button size="sm" variant="default">Proses</Button>
                            </form>
                        )}
                        {order.status === 'PROCESSING' && (
                            <form action={handleStatusUpdate}>
                                <input type="hidden" name="id" value={order.id} />
                                <input type="hidden" name="status" value="COMPLETED" />
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">Selesai</Button>
                            </form>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
