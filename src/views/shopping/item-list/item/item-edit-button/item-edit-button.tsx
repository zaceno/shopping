import "./item-edit-button.css"
import { withFocus } from "@/lib/event-decorators"
import { type Item, StopEditing, StartEditing } from "@/main"
import { IconButton } from "@/lib/buttons/icon-button"

type ItemEditButtonProps = {
  item: Item
  editing: boolean
}

export function ItemEditButton(props: ItemEditButtonProps) {
  const MyStartEditing = withFocus(".item__text-input", [
    StartEditing,
    props.item.id,
  ])
  const MyStopEditing = [StopEditing, props.item.id] as const
  return (
    <IconButton
      icon="pen"
      class="item__edit-button"
      onclick={props.editing ? MyStopEditing : MyStartEditing}
      active={props.editing}
      disabled={props.item.done > 0}
    />
  )
}
