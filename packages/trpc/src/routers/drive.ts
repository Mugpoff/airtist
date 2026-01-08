import { driveConnectUrlHandler } from "../handlers/drive/connect-url"
import { driveGetThumbUrlHandler } from "../handlers/drive/get-thumb-url"
import { driveImportImagesHandler } from "../handlers/drive/import-images"
import { driveListConnectionsHandler } from "../handlers/drive/list-connections"
import { driveListFoldersHandler } from "../handlers/drive/list-folders"
import { driveListItemsHandler } from "../handlers/drive/list-items"
import { driveStatusHandler } from "../handlers/drive/status"
import { createTRPCRouter } from "../trpc"

export const driveRouter = createTRPCRouter({
  connectUrl: driveConnectUrlHandler,
  status: driveStatusHandler,
  listConnections: driveListConnectionsHandler,
  listFolders: driveListFoldersHandler,
  listItems: driveListItemsHandler,
  getThumbUrl: driveGetThumbUrlHandler,
  importImages: driveImportImagesHandler,
})
