import "./item-edit-button.css"
import { type ItemID, StartEditing, StopEditing } from "@/main"
import { withFocus } from "@/lib/event-decorators"
import { IconButton } from "@/lib/buttons/icon-button"

type ItemEditButtonProps = {
  itemID: ItemID
  editing: boolean
  focusOnEdit: string
  disabled?: boolean
}

export function ItemEditButton(props: ItemEditButtonProps) {
  const MyStartEditing = withFocus(props.focusOnEdit, [
    StartEditing,
    props.itemID,
  ])
  const MyStopEditing = [StopEditing, props.itemID] as const
  return (
    <IconButton
      icon="pen"
      class="item__edit-button"
      onclick={props.editing ? MyStopEditing : MyStartEditing}
      active={props.editing}
      disabled={props.disabled}
    />
  )
}
