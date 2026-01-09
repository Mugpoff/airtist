import DF from "ioredis"
import { env } from "./env"

let client: DF | null = null

export const rawCacheClient = () => {
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
        rawCacheClient().setex(`users:auth:${id}`, ttl, value),
      get: (id: string) => rawCacheClient().get(`users:auth:${id}`),
      delete: (id: string) =>
        rawCacheClient()
          .del(`users:auth:${id}`)
          .then(() => null),
    },
  },
  images: {
    cacheIdByHash: {
      get: (hash: string) => rawCacheClient().get(`images:studio:hash:${hash}`),
      set: (hash: string, cacheId: string, ttl = 60 * 60 * 24 * 7) =>
        rawCacheClient().setex(`images:studio:hash:${hash}`, ttl, cacheId),
      delete: (hash: string) =>
        rawCacheClient()
          .del(`images:studio:hash:${hash}`)
          .then(() => null),
    },
  },
  drive: {
    thumbUrlByFileId: {
      get: (fileId: string) => rawCacheClient().get(`drive:thumb:${fileId}`),
      set: (fileId: string, url: string, ttl = 60 * 60 * 24 * 7) =>
        rawCacheClient().setex(`drive:thumb:${fileId}`, ttl, url),
      delete: (fileId: string) =>
        rawCacheClient()
          .del(`drive:thumb:${fileId}`)
          .then(() => null),
    },
    oauthState: {
      set: (state: string, userId: string, ttl = 60 * 10) =>
        rawCacheClient().setex(`drive:oauth:state:${state}`, ttl, userId),
      get: (state: string) =>
        rawCacheClient().get(`drive:oauth:state:${state}`),
      delete: (state: string) =>
        rawCacheClient()
          .del(`drive:oauth:state:${state}`)
          .then(() => null),
    },
  },
  models: {
    get: () => rawCacheClient().get("models:images"),
    set: (value: string, ttl = 60 * 60 * 6) =>
      rawCacheClient().setex("models:images", ttl, value),
    delete: () =>
      rawCacheClient()
        .del("models:images")
        .then(() => null),
  },
}
