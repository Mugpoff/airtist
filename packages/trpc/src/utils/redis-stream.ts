import { rawCacheClient } from "@repo/cache"

export const pushStatus = async (jobId: string, status: object) => {
  const redis = rawCacheClient()
  const serialized = JSON.stringify({ ...status, timestamp: Date.now() })
  await redis.rpush(`job:${jobId}:history`, serialized)
  await redis.expire(`job:${jobId}:history`, 3600)
  await redis.publish(`job:${jobId}:events`, serialized)
}

export const getJobHistory = async (jobId: string) => {
  const redis = rawCacheClient()
  const history = await redis.lrange(`job:${jobId}:history`, 0, -1)
  return history.map((h: string) => JSON.parse(h))
}
