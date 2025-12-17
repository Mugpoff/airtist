// @ts-expect-error this path is from the node_modules folder
import type messages from "../../../../../packages/messages/src/en.json"

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages
  }
}
