import { Redis } from "ioredis"
import { env } from "../env"
import { ee, type GenerationProgress } from "./event-emitter"

const redisSubscriber = new Redis(env.DRAGONFLY_URL)

const PROGRESS_CHANNEL = "generation-progress"

redisSubscriber.subscribe(PROGRESS_CHANNEL, (err) => {
  if (err) console.error("Failed to subscribe to progress channel:", err)
})

redisSubscriber.on("message", (channel, message) => {
  if (channel === PROGRESS_CHANNEL) {
    try {
      const parsed = JSON.parse(message) as {
        requestId: string
        progress: GenerationProgress
      }
      ee.emit(`progress:${parsed.requestId}`, parsed.progress)
    } catch (e) {
      console.error("Failed to parse progress message:", e)
    }
  }
})
