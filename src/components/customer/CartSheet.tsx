"use client"

import { useState } from "react"
import { useCartStore } from "@/lib/store"
import { submitOrder } from "@/server/actions"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Trash2, Plus, Minus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast" 

export function CartSheet() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState("take_away")
  const [paymentMethod, setPaymentMethod] = useState("tunai")

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num)
  }

  async function handleCheckout() {
    if (items.length === 0) return
    
    setIsLoading(true)
    
    try {
      const result = await submitOrder({
        items: items.map(i => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price
        })),
        totalAmount: totalPrice(),
        metode_pemesanan: deliveryMethod as any,
        metode_pembayaran: paymentMethod as any,
        customerName: customerName || "Pelanggan"
      })

      if (result.success) {
        clearCart()
        setIsOpen(false)
        alert(`Pesanan Berhasil! ID: ${result.order_id}\n${result.message}`)
        if (result.status === "redirect" && result.link) {
            window.location.href = result.link
        }
      } else {
        alert("Gagal: " + result.message)
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-xs flex items-center justify-center text-white border-2 border-background">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Keranjang Pesanan</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <ShoppingCart className="h-10 w-10 mb-2 opacity-20" />
              <p>Keranjang kosong</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 items-start border-b pb-3">
                <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                   {item.image ? <img src={item.image} className="w-full h-full object-cover"/> : null}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-primary text-sm font-bold">{formatRupiah(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive/90"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Nama Pelanggan</label>
                <Input 
                    placeholder="Masukkan nama Anda" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Pengiriman</label>
                    <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="take_away">Ambil Sendiri</SelectItem>
                            <SelectItem value="delivery">Delivery</SelectItem>
                            <SelectItem value="gofood">GoFood</SelectItem>
                            <SelectItem value="grabfood">GrabFood</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Pembayaran</label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tunai">Tunai</SelectItem>
                            <SelectItem value="m_banking">Transfer</SelectItem>
                            <SelectItem value="shopeepay">ShopeePay</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatRupiah(totalPrice())}</span>
            </div>

            <SheetFooter>
              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Memproses..." : "Pesan Sekarang"}
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
