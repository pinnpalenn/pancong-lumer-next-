"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"
import { Plus } from "lucide-react"

interface ProductProps {
  id: number
  name: string
  price: string
  image: string | null
}

export function ProductCard({ id, name, price, image }: ProductProps) {
  const addItem = useCartStore((state) => state.addItem)
  const priceNumber = Number(price)

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num)
  }

  return (
    <Card className="flex flex-col justify-between overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="aspect-square w-full bg-muted relative flex items-center justify-center text-muted-foreground">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-4xl">🥞</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg line-clamp-2">{name}</CardTitle>
        <p className="text-primary font-bold mt-2">
          {formatRupiah(priceNumber)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full font-bold" 
          onClick={() => addItem({ id, name, price: priceNumber, image })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah
        </Button>
      </CardFooter>
    </Card>
  )
}
