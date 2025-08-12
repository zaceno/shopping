import "./toolbar-button.css"
import { Button, ButtonProps } from "@/lib/buttons/button"
import { Icon, type IconNames } from "@/lib/icons/icon"

export type ToolbarButtonProps<S, X> = ButtonProps<S, X> & {
  icon: IconNames
  label: string
  alerts?: number
}
export function ToolbarButton<S, X>(props: ToolbarButtonProps<S, X>) {
  const { icon, label, alerts, class: cls, ...button } = props
  return (
    <Button class={["toolbar-button", cls]} {...button}>
      <Icon class="toolbar-button__icon" name={icon} />
      <span class="toolbar-button__text">{label}</span>
      <div class="toolbar-button__alerts">{alerts}</div>
    </Button>
  )
}
