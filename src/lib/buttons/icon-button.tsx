import "./icon-button.css"
import { Button, type ButtonProps } from "./button"
import { type IconNames, Icon } from "@/lib/icons/icon"

export type IconButtonProps<S, X> = { icon: IconNames } & ButtonProps<S, X>

export function IconButton<S, X>(props: IconButtonProps<S, X>) {
  return (
    <Button {...props} class={["icon-button", props.class]}>
      <Icon name={props.icon} />
    </Button>
  )
}
