import { type State, SetMode } from "@/main"
import {
  type ToolbarButtonProps,
  ToolbarButton,
} from "./toolbar-button/toolbar-button"

type ModeType = State["mode"]
type ModeProp = { mode: ModeType }
type TBP = ToolbarButtonProps<State, ModeType>

type SetModeButtonProps = {
  currentMode: ModeType
  setsMode: ModeType
  alerts?: TBP["alerts"]
  icon: TBP["icon"]
  label: TBP["label"]
}

function SetModeButton(props: SetModeButtonProps) {
  return (
    <ToolbarButton
      active={props.setsMode === props.currentMode}
      onclick={[SetMode, props.setsMode]}
      icon={props.icon}
      label={props.label}
      alerts={props.alerts}
    />
  )
}

export function SetNormalModeButton({ mode }: ModeProp) {
  return (
    <SetModeButton
      currentMode={mode}
      setsMode="normal"
      icon="checked"
      label="Shop"
    />
  )
}

export function SetReorderModeButton({ mode }: ModeProp) {
  return (
    <SetModeButton
      setsMode="reorder"
      currentMode={mode}
      icon="shuffle"
      label="Reorder"
    />
  )
}

export function SetPostponeModeButton({ mode }: ModeProp) {
  return (
    <SetModeButton
      setsMode="postpone"
      currentMode={mode}
      icon="forward"
      label="Postpone"
    />
  )
}

export function SetRepeatModeButton({ mode }: ModeProp) {
  return (
    <SetModeButton
      setsMode="repeating"
      currentMode={mode}
      icon="repeat"
      label="Repeat"
    />
  )
}
