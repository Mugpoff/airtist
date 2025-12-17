import DF from "ioredis";
import { env } from "./env";
const client = new DF(env.DRAGONFLY_URL);
export const cacheClient = {
    users: {
        auth: {
            set: (id, value, ttl = 60) => client.setex(`users:auth:${id}`, ttl, value),
            get: (id) => client.get(`users:auth:${id}`),
            delete: (id) => client.del(`users:auth:${id}`).then(() => null),
        },
    },
};
