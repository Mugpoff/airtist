import { EventEmitter, on } from "events"

export type GenerationStep =
  | "STARTING"
  | "SENDING_TO_AI"
  | "WAITING_FOR_AI"
  | "DOWNLOADING_IMAGE"
  | "UPLOADING_TO_STORAGE"
  | "SAVING_TO_DB"
  | "COMPLETED"
  | "FAILED"

export type GenerationProgress = {
  step: GenerationStep
  message?: string
  imageUrl?: string
}

export class RedisEventEmitter extends EventEmitter {
  toIterable(eventName: string, opts?: { signal?: AbortSignal }) {
    return on(this, eventName, opts)
  }
}

export const ee = new RedisEventEmitter()
