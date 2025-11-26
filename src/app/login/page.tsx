"use client"

import { useActionState } from "react"
import { login, type AuthState } from "@/server/auth" // Import type juga
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

// Pastikan struktur ini cocok dengan AuthState di server/auth.ts
const initialState: AuthState = {
  message: "",
  errors: {},
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Login Admin</CardTitle>
          <CardDescription>
            Masuk untuk mengelola Pancong Lumer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                name="username" 
                type="text" 
                placeholder="admin" 
                // Matikan validasi HTML default biar error backend terlihat
                // required 
              />
              {state?.errors?.username && (
                <p className="text-sm text-destructive font-medium">
                  {state.errors.username[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password"
                // required 
              />
              {state?.errors?.password && (
                <p className="text-sm text-destructive font-medium">
                  {state.errors.password[0]}
                </p>
              )}
            </div>
            
            {/* Tampilkan pesan error global (misal: password salah) */}
            {state?.message && !state?.errors && (
              <p className="text-sm text-destructive font-medium text-center">
                {state.message}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
