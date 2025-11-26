"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createSession, deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"

// 1. Definisikan tipe State agar konsisten antara Frontend & Backend
export type AuthState = {
  message?: string
  errors?: {
    username?: string[]
    password?: string[]
  }
}

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username wajib diisi" }),
  password: z.string().min(1, { message: "Password wajib diisi" }),
})

// 2. Gunakan tipe AuthState di parameter prevState dan return promise
export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const result = loginSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      message: "Input tidak valid"
    }
  }

  const { username, password } = result.data

  try {
    const admin = await prisma.admin.findUnique({
      where: { username },
    })

    if (!admin || admin.password !== password) {
      return {
        message: "Username atau password salah.",
      }
    }

    await createSession(admin.id, admin.username)
  } catch (error) {
    // Tangkap error database jika ada
    return { message: "Terjadi kesalahan server." }
  }

  // 3. Redirect harus di luar try/catch agar tidak dianggap error oleh Next.js
  redirect("/dashboard")
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}
