import {
  Toolbar as LibToolbar,
  ToolbarButton,
  ToolbarSpacer,
} from "@/lib/toolbar/toolbar"
import { type State, SetMode, ClearDone, countDone } from "@/main"

export function Toolbar(state: State) {
  return (
    <LibToolbar>
      <ToolbarButton
        icon="checked"
        label="Shop"
        key="normal"
        onclick={[SetMode, "normal"]}
        active={state.mode === "normal"}
      />
      <ToolbarButton
        icon="shuffle"
        label="Reorder"
        key="reorder"
        onclick={[SetMode, "reorder"]}
        active={state.mode === "reorder"}
      />
      <ToolbarButton
        icon="forward"
        label="Postpone"
        key="postpone"
        onclick={[SetMode, "postpone"]}
        active={state.mode === "postpone"}
      />
      <ToolbarButton
        icon="repeat"
        label="Repeating"
        key="repeat"
        onclick={[SetMode, "repeating"]}
        active={state.mode === "repeating"}
      />

      <ToolbarSpacer />

      <ToolbarButton
        disabled={countDone(state) === 0}
        key="cleardone"
        icon="trash"
        style="red"
        label="Clear done"
        onclick={ClearDone}
      />
    </LibToolbar>
  )
}
