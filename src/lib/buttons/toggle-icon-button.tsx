import { type IconButtonProps, IconButton } from "./icon-button"
export type ToggleIconButtonProps<S, X> = {
  active: boolean
  ontoggle: IconButtonProps<S, X>["onclick"]
  icon: IconButtonProps<S, X>["icon"]
  activeIcon?: IconButtonProps<S, X>["icon"]
  class?: IconButtonProps<S, X>["class"]
  disabled?: boolean
}
export function ToggleIconButton<S, X>(props: ToggleIconButtonProps<S, X>) {
  let icon = props.icon
  if (props.active && props.activeIcon) icon = props.activeIcon
  return (
    <IconButton
      disabled={props.disabled}
      onclick={props.ontoggle}
      icon={icon}
      class={[
        { "button--active": props.active },
        "toggle-icon-button",
        props.class,
      ]}
    />
  )
}
