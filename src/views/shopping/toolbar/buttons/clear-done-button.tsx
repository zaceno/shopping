import { ClearDone, countDone, type State } from "@/main"
import { ToolbarButton } from "./toolbar-button/toolbar-button"

export function ClearDoneButton({ state }: { state: State }) {
  return (
    <ToolbarButton
      class="toolbar-button--red"
      disabled={countDone(state) === 0}
      icon="trash"
      label="Clear done"
      onclick={ClearDone}
    />
  )
}
