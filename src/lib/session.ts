import "server-only"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secretKey = process.env.AUTH_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

type SessionPayload = {
  userId: string
  username: string
  expiresAt: Date
}

export async function createSession(userId: string, username: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await new SignJWT({ userId, username, expiresAt })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)

  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })
}

export async function verifySession(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload as SessionPayload
  } catch (error) {
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
