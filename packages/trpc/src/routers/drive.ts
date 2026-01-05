import { driveConnectUrlHandler } from "../handlers/drive-connect-url-handler"
import { driveGetThumbUrlHandler } from "../handlers/drive-get-thumb-url-handler"
import { driveImportImagesHandler } from "../handlers/drive-import-images-handler"
import { driveListConnectionsHandler } from "../handlers/drive-list-connections-handler"
import { driveListFoldersHandler } from "../handlers/drive-list-folders-handler"
import { driveListItemsHandler } from "../handlers/drive-list-items-handler"
import { driveStatusHandler } from "../handlers/drive-status-handler"
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
