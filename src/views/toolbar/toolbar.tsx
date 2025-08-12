import "./toolbar.css"
import { Button, ButtonProps } from "@/lib/buttons/button"
import { Icon, type IconNames } from "@/lib/icons/icon"
import { type State, SetMode, ClearDone, countDone } from "@/main"

type ToolbarButtonProps<S, X> = ButtonProps<S, X> & {
  icon: IconNames
  label: string
  alerts?: number
}
function ToolbarButton<S, X>(props: ToolbarButtonProps<S, X>) {
  const { icon, label, alerts, class: cls, ...button } = props
  return (
    <Button class={["toolbar-button", cls]} {...button}>
      <Icon class="toolbar-button__icon" name={icon} />
      <span class="toolbar-button__text">{label}</span>
      <div class="toolbar-button__alerts">{alerts}</div>
    </Button>
  )
}

type ClearDoneButtonProps = Pick<ToolbarButtonProps<any, any>, "disabled">
function ClearDoneButton(props: ClearDoneButtonProps) {
  return (
    <ToolbarButton
      class="toolbar-button--red"
      disabled={props.disabled}
      icon="trash"
      label="Clear done"
      onclick={ClearDone}
    />
  )
}

type SetModeButtonProps<S, X> = Omit<
  ToolbarButtonProps<S, X>,
  "onclick" | "class" | "disabled"
> & { forMode: State["mode"]; currentMode: State["mode"] }
function SetModeButton<S, X>(props: SetModeButtonProps<S, X>) {
  return (
    <ToolbarButton
      active={props.forMode === props.currentMode}
      onclick={[SetMode, props.forMode]}
      icon={props.icon}
      label={props.label}
      alerts={props.alerts}
    />
  )
}

type ModeProp = { mode: State["mode"] }

const SetNormalButton = ({ mode }: ModeProp) => (
  <SetModeButton
    forMode="normal"
    currentMode={mode}
    icon="checked"
    label="Shop"
  />
)

const SetReorderButton = ({ mode }: ModeProp) => (
  <SetModeButton
    forMode="reorder"
    currentMode={mode}
    icon="shuffle"
    label="Reorder"
  />
)

const SetPostponeButton = ({ mode }: ModeProp) => (
  <SetModeButton
    forMode="postpone"
    currentMode={mode}
    icon="forward"
    label="Postpone"
  />
)

const SetRepeatButton = ({ mode }: ModeProp) => (
  <SetModeButton
    forMode="repeating"
    currentMode={mode}
    icon="repeat"
    label="Repeat"
  />
)

export function Toolbar(state: State) {
  return (
    <div class="toolbar">
      <SetNormalButton mode={state.mode} />
      <SetReorderButton mode={state.mode} />
      <SetPostponeButton mode={state.mode} />
      <SetRepeatButton mode={state.mode} />
      <div class="toolbar__spacer"></div>
      <ClearDoneButton disabled={countDone(state) === 0} />
    </div>
  )
}
