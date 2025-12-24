import { EventEmitter, on } from "node:events"

export type GenerationProgress = {
  step:
    | "STARTING"
    | "SENDING_TO_AI"
    | "WAITING_FOR_AI"
    | "DOWNLOADING_IMAGE"
    | "UPLOADING_TO_STORAGE"
    | "SAVING_TO_DB"
    | "COMPLETED"
    | "FAILED"
  message?: string
  imageUrl?: string
}

class RedisEventEmitter extends EventEmitter {
  toIterable(eventName: string, opts?: { signal?: AbortSignal }) {
    return on(this, eventName, opts)
  }
}

export const ee = new RedisEventEmitter()
