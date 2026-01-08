import { cacheClient } from "@repo/cache"

const getRedis = () => cacheClient.getClient()

export const pushStatus = async (jobId: string, status: object) => {
  const redis = getRedis()
  const serialized = JSON.stringify({ ...status, timestamp: Date.now() })
  await redis.rpush(`job:${jobId}:history`, serialized)
  await redis.expire(`job:${jobId}:history`, 3600)
  await redis.publish(`job:${jobId}:events`, serialized)
}

export const getJobHistory = async (jobId: string) => {
  const redis = getRedis()
  const history = await redis.lrange(`job:${jobId}:history`, 0, -1)
  return history.map((h: string) => JSON.parse(h))
}
