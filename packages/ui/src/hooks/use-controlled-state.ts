import { useCallback, useState } from "react"

type UseControlledStateProps<T> = {
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
}

export function useControlledState<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: UseControlledStateProps<T>): [T, (value: T) => void] {
  const [internalValue, setInternalValue] = useState<T>(
    controlledValue ?? defaultValue ?? (false as T),
  )

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const setValue = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onChange?.(newValue)
    },
    [isControlled, onChange],
  )

  return [value, setValue]
}
