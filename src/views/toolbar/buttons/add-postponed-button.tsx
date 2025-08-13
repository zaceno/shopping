import { countPostponed, AddPostponed, type State } from "@/main"
import { ToolbarButton } from "./toolbar-button/toolbar-button"

export function AddPostponedButton({ state }: { state: State }) {
  const nbrPostponed = countPostponed(state)
  return (
    <ToolbarButton
      class="toolbar-button--green"
      disabled={!nbrPostponed}
      icon="plus"
      label="Postponed"
      onclick={AddPostponed}
      alerts={nbrPostponed}
    />
  )
}
