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
        <div>part 3</div>
      </div>
    </div>
  )
}
