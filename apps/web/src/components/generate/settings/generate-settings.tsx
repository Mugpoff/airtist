import {
  Popover,
  PopoverCreateHandle,
  PopoverPopup,
} from "@repo/ui/base/popover"
import { GenerateSettingsBackground } from "./generate-settings-background"
import { GenerateSettingsEthnicity } from "./generate-settings-ethnicity"
import { GenerateSettingsPreset } from "./generate-settings-preset"
import { GenerateSettingsPrompt } from "./generate-settings-prompt"
import { GenerateSettingsWeight } from "./generate-settings-weight"

const popoverHandle = PopoverCreateHandle<React.ComponentType>()

export const GenerateSettings = () => {
  return (
    <div className="flex gap-4">
      <GenerateSettingsPreset handle={popoverHandle} />
      <GenerateSettingsEthnicity handle={popoverHandle} />
      <GenerateSettingsWeight handle={popoverHandle} />
      <GenerateSettingsBackground handle={popoverHandle} />
      <GenerateSettingsPrompt handle={popoverHandle} />
      <Popover handle={popoverHandle}>
        {({ payload: Payload }) => (
          <PopoverPopup
            className="w-72 [&>div]:[&>div]:space-y-4"
            align="start"
            sideOffset={8}
          >
            {Payload !== undefined && <Payload />}
          </PopoverPopup>
        )}
      </Popover>
    </div>
  )
}
