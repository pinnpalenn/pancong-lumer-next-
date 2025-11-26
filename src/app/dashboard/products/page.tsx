import { getProducts } from "@/server/data"
import { toggleProductAvailability } from "@/server/actions"
import { revalidatePath } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default async function ProductsPage() {
  const products = await getProducts()

  const handleToggle = async (formData: FormData) => {
    "use server"
    const id = Number(formData.get("id"))
    const currentStatus = formData.get("current") === "true"
    await toggleProductAvailability(id, !currentStatus)
    revalidatePath("/dashboard/products")
    revalidatePath("/menu") // Update juga halaman customer
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manajemen Menu</h1>
        <Button>+ Tambah Menu Baru</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
            <Card key={product.id} className={product.isAvailable ? "" : "opacity-60 bg-muted"}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-bold">{product.name}</CardTitle>
                    <form action={handleToggle}>
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="current" value={String(product.isAvailable)} />
                        <Button 
                            size="sm" 
                            variant={product.isAvailable ? "outline" : "destructive"}
                            className="h-8 text-xs"
                        >
                            {product.isAvailable ? "Tersedia" : "Habis"}
                        </Button>
                    </form>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">Harga: Rp {Number(product.price).toLocaleString('id-ID')}</div>
                    <div className="mt-2 h-32 w-full bg-muted rounded-md overflow-hidden">
                        {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full">No Image</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
