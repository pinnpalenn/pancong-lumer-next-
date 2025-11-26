import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/20 p-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
          Pancong Lumer
        </h1>
        <p className="text-muted-foreground">
          Nikmati sensasi lumer di setiap gigitan.
        </p>
      </div>
      
      <div className="flex gap-4">
        <Link href="/menu">
          <Button size="lg" className="font-bold">Lihat Menu</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg">Login Admin</Button>
        </Link>
      </div>
    </div>
  )
}
