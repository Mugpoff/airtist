import { createContext, useContext } from "react"

export function getStrictContext<T>(name: string) {
  const Context = createContext<T | null>(null)
  Context.displayName = name

  function useStrictContext() {
    const context = useContext(Context)
    if (context === null) {
      throw new Error(`use${name} must be used within a ${name}Provider`)
    }
    return context
  }

  return [Context.Provider, useStrictContext] as const
}
