import { type ItemID, ToggleDone } from "@/main"
import { IconButton } from "@/lib/buttons/icon-button"
import { withAnimatedElementOnTop } from "@/lib/listview/listview"
type DoneButtonProps = {
  itemID: ItemID
  done: boolean
  disabled?: boolean
}
export function ItemDoneButton(props: DoneButtonProps) {
  return (
    <IconButton
      class="item__done-button"
      icon={props.done ? "checked" : "unchecked"}
      onclick={withAnimatedElementOnTop([ToggleDone, props.itemID])}
      active={props.done}
      disabled={props.disabled}
    />
  )
}
