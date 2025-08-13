import "./toolbar.css"
import { type State } from "@/main"
import { ClearDoneButton } from "./buttons/clear-done-button"
import { AddPostponedButton } from "./buttons/add-postponed-button"
import { AddRepeatingButton } from "./buttons/add-repeating-button"
import {
  SetNormalModeButton,
  SetReorderModeButton,
  SetPostponeModeButton,
  SetRepeatModeButton,
} from "./buttons/set-mode-buttons"

export function Toolbar(state: State) {
  return (
    <div class="toolbar">
      <SetNormalModeButton state={state} />
      <SetReorderModeButton state={state} />
      <SetPostponeModeButton state={state} />
      <SetRepeatModeButton state={state} />
      <div class="toolbar__spacer"></div>
      {state.mode === "postpone" ? (
        <AddPostponedButton state={state} />
      ) : state.mode === "repeating" ? (
        <AddRepeatingButton state={state} />
      ) : (
        <ClearDoneButton state={state} />
      )}
    </div>
  )
}
