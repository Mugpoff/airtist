export type InferNestedValues<T> = T extends object
  ? { [K in keyof T]: InferNestedValues<T[K]> }[keyof T]
  : T
