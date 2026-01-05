import { driveConnectUrlHandler } from "./handlers/drive-connect-url-handler"
import { driveGetThumbUrlHandler } from "./handlers/drive-get-thumb-url-handler"
import { driveImportImagesHandler } from "./handlers/drive-import-images-handler"
import { driveListConnectionsHandler } from "./handlers/drive-list-connections-handler"
import { driveListFoldersHandler } from "./handlers/drive-list-folders-handler"
import { driveListItemsHandler } from "./handlers/drive-list-items-handler"
import { driveStatusHandler } from "./handlers/drive-status-handler"
import { imagesByIdHandler } from "./handlers/images-by-id-handler"
import { imagesDeleteHandler } from "./handlers/images-delete-handler"
import { imagesGenerateStudioHandler } from "./handlers/images-generate-studio-handler"
import { imagesListHandler } from "./handlers/images-list-handler"
import { imagesModelsHandler } from "./handlers/images-models-handler"
import { pingHandler } from "./handlers/ping-handler"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  ping: pingHandler,
  images: createTRPCRouter({
    list: imagesListHandler,
    byId: imagesByIdHandler,
    generateStudio: imagesGenerateStudioHandler,
    delete: imagesDeleteHandler,
    models: imagesModelsHandler,
  }),
  drive: createTRPCRouter({
    connectUrl: driveConnectUrlHandler,
    status: driveStatusHandler,
    listConnections: driveListConnectionsHandler,
    listFolders: driveListFoldersHandler,
    listItems: driveListItemsHandler,
    getThumbUrl: driveGetThumbUrlHandler,
    importImages: driveImportImagesHandler,
  }),
})

export type AppRouter = typeof appRouter
