import { countRepeating, AddRepeating, type State } from "@/main"
import { ToolbarButton } from "./toolbar-button/toolbar-button"

export function AddRepeatingButton({ state }: { state: State }) {
  const nbrRepeating = countRepeating(state)
  return (
    <ToolbarButton
      class="toolbar-button--green"
      disabled={!nbrRepeating}
      icon="plus"
      label="Repeating"
      onclick={AddRepeating}
      alerts={nbrRepeating}
    />
  )
}
