import { driveGetThumbUrlHandler } from "./handlers/drive-get-thumb-url-handler"
import { driveImportImagesHandler } from "./handlers/drive-import-images-handler"
import { driveListFoldersHandler } from "./handlers/drive-list-folders-handler"
import { driveListItemsHandler } from "./handlers/drive-list-items-handler"
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
    listFolders: driveListFoldersHandler,
    listItems: driveListItemsHandler,
    getThumbUrl: driveGetThumbUrlHandler,
    importImages: driveImportImagesHandler,
  }),
})

export type AppRouter = typeof appRouter
