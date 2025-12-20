import { LanguageSelector } from "@/components/ui/language-selector"
import { SignOutButton } from "@/components/ui/sign-out-button"
import { ThemeSwitch } from "@/components/ui/theme-switch"
import { ShimmerButton } from "@repo/ui/buttons/shimmer-button"
import { GenerateDropzone } from "./generate-dropzone"

export const GenerateContent = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <GenerateDropzone />
      <div className="grid grid-cols-3">
        <div>part 1</div>
        <div className="flex justify-center">
          <ShimmerButton className="px-12">Generate</ShimmerButton>
        </div>
        <div className="flex items-center justify-end gap-2">
          <ThemeSwitch />
          <LanguageSelector />
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}
