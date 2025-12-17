import { OpenRouter } from "@openrouter/sdk";
import { env } from "../env";
export const openRouterClient = new OpenRouter({
    apiKey: env.OPENROUTER_API_KEY,
});
