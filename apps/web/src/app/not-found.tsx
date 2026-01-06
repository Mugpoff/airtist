import { getTranslations } from "next-intl/server"

export default async function NotFound() {
  const t = await getTranslations("notFound")

  return (
    <main className="relative flex h-screen w-full justify-center">
      <div className="relative mt-16 mb-16 flex w-full select-none justify-center border-y">
        <div className="absolute flex h-[calc(100vh-128px-192px)] w-full justify-center self-center border-y">
          <div className="-mt-24 absolute h-[95px] w-px bg-border" />
          <div className="-mb-24 absolute bottom-0 h-[95px] w-px bg-border" />
          <div className="mx-12 w-full border-x" />
        </div>
        <div className="-mb-16 h-[calc(var(--spacing)*16-1px)] w-1/3 self-end border-x" />
      </div>
      <div className="absolute flex flex-col items-center justify-center self-center">
        <h1 className="-rotate-12 absolute select-none font-bold font-heading text-[300px] tracking-widest opacity-10">
          {t("title")}
        </h1>
        <p className="z-10 font-medium text-lg">{t("description")}</p>
      </div>
    </main>
  )
}
