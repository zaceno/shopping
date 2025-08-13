import { type State, SetMode, countPostponed } from "@/main"
import {
  type ToolbarButtonProps,
  ToolbarButton,
} from "./toolbar-button/toolbar-button"

type ModeType = State["mode"]
type TBP = ToolbarButtonProps<State, ModeType>

type SetModeButtonProps = {
  currentMode: ModeType
  setsMode: ModeType
  alerts?: TBP["alerts"]
  icon: TBP["icon"]
  label: TBP["label"]
}

function SetModeButton(props: SetModeButtonProps) {
  const active = props.setsMode === props.currentMode
  const alerts = !active ? props.alerts : 0
  return (
    <ToolbarButton
      active={active}
      onclick={[SetMode, props.setsMode]}
      icon={props.icon}
      label={props.label}
      alerts={alerts}
    />
  )
}

export function SetNormalModeButton({ state }: { state: State }) {
  return (
    <SetModeButton
      currentMode={state.mode}
      setsMode="normal"
      icon="checked"
      label="Shop"
    />
  )
}

export function SetReorderModeButton({ state }: { state: State }) {
  return (
    <SetModeButton
      setsMode="reorder"
      currentMode={state.mode}
      icon="shuffle"
      label="Reorder"
    />
  )
}

export function SetPostponeModeButton({ state }: { state: State }) {
  return (
    <SetModeButton
      setsMode="postpone"
      currentMode={state.mode}
      icon="forward"
      label="Postpone"
      alerts={countPostponed(state)}
    />
  )
}

export function SetRepeatModeButton({ state }: { state: State }) {
  return (
    <SetModeButton
      setsMode="repeating"
      currentMode={state.mode}
      icon="repeat"
      label="Repeat"
    />
  )
}
