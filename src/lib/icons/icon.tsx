import "./icon.css"
import { type ClassProp } from "hyperapp"

const SPRITES_FILE = "./icon-sprites.svg"
export type IconNames =
  | "pen"
  | "trash"
  | "plus"
  | "checked"
  | "unchecked"
  | "forward"
  | "reverse"
  | "repeat"
  | "shuffle"

type IconProps = {
  name: IconNames
  class?: ClassProp
}

export function Icon(props: IconProps) {
  return (
    <svg class={["icon", props.class]}>
      <use href={`${SPRITES_FILE}#${props.name}`} />
    </svg>
  )
}
