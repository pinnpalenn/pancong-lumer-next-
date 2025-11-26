import { getProducts } from "@/server/data"
import { ProductCard } from "@/components/customer/ProductCard"
import { CustomerNavbar } from "@/components/customer/CustomerNavbar"

export default async function MenuPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Daftar Menu</h1>
          <p className="text-muted-foreground mt-2">
            Pilih varian pancong favoritmu dan nikmati lumerannya!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price.toString()}
              image={product.image}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
    