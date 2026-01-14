"use client"

import type { Session } from "@repo/auth/server"
import { createContext, type ReactNode, useContext, useRef } from "react"
import { createStore, useStore } from "zustand"

type State = {
  user: Session["user"] | null
  session: Session["session"] | null

  // Computed helpers
  isAdmin: boolean

  signIn: (user: Session["user"]) => void
  signOut: () => void
}

type AuthStore = ReturnType<typeof createAuthStore>

const createAuthStore = (session: Session | null) =>
  createStore<State>((set) => ({
    user: session?.user ?? null,
    session: session?.session ?? null,

    // Computed based on user role
    isAdmin: session?.user?.role === "admin",

    signIn: (user: Session["user"]) => {
      set({ user, isAdmin: user?.role === "admin" })
    },
    signOut: () => {
      set({ user: null, session: null, isAdmin: false })
    },
  }))

/**
 * React part.
 */
const AuthContext = createContext<AuthStore | null>(null)

export const AuthStoreProvider = ({
  children,
  session,
}: {
  children: ReactNode
  session: Session | null
}) => {
  const storeRef = useRef<AuthStore>(null)

  if (!storeRef.current) {
    storeRef.current = createAuthStore(session)
  }

  return (
    <AuthContext.Provider value={storeRef.current}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const store = useContext(AuthContext)

  if (!store) {
    throw new Error("useAuth must be used within a AuthContext")
  }

  return useStore(store, (state) => state)
}
