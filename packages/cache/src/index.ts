import DF from "ioredis"
import { env } from "./env"

let client: DF | null = null

const getClient = () => {
  if (!client) {
    client = new DF(env.DRAGONFLY_URL, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
    })
  }
  return client
}

export const cacheClient = {
  users: {
    auth: {
      set: (id: string, value: string, ttl = 60) =>
        getClient().setex(`users:auth:${id}`, ttl, value),
      get: (id: string) => getClient().get(`users:auth:${id}`),
      delete: (id: string) =>
        getClient()
          .del(`users:auth:${id}`)
          .then(() => null),
    },
  },
  images: {
    cacheIdByHash: {
      get: (hash: string) => getClient().get(`images:studio:hash:${hash}`),
      set: (hash: string, cacheId: string, ttl = 60 * 60 * 24 * 7) =>
        getClient().setex(`images:studio:hash:${hash}`, ttl, cacheId),
      delete: (hash: string) =>
        getClient()
          .del(`images:studio:hash:${hash}`)
          .then(() => null),
    },
  },
  drive: {
    thumbUrlByFileId: {
      get: (fileId: string) => getClient().get(`drive:thumb:${fileId}`),
      set: (fileId: string, url: string, ttl = 60 * 60 * 24 * 7) =>
        getClient().setex(`drive:thumb:${fileId}`, ttl, url),
      delete: (fileId: string) =>
        getClient()
          .del(`drive:thumb:${fileId}`)
          .then(() => null),
    },
  },
  models: {
    get: () => getClient().get("models:images"),
    set: (value: string, ttl = 60 * 60 * 6) =>
      getClient().setex("models:images", ttl, value),
    delete: () =>
      getClient()
        .del("models:images")
        .then(() => null),
  },
}
