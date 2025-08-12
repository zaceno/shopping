import "./toolbar.css"
import { type State } from "@/main"
import { ClearDoneButton } from "./buttons/clear-done-button"
import {
  SetNormalModeButton,
  SetReorderModeButton,
  SetPostponeModeButton,
  SetRepeatModeButton,
} from "./buttons/set-mode-buttons"

export function Toolbar(state: State) {
  return (
    <div class="toolbar">
      <SetNormalModeButton mode={state.mode} />
      <SetReorderModeButton mode={state.mode} />
      <SetPostponeModeButton mode={state.mode} />
      <SetRepeatModeButton mode={state.mode} />
      <div class="toolbar__spacer"></div>
      <ClearDoneButton state={state} />
    </div>
  )
}
