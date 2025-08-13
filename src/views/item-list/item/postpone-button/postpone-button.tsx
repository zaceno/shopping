import "./postpone-button.css"
import { type Item, Postpone } from "@/main"
import { IconButton } from "@/lib/buttons/icon-button"

type PostponeButtonProps = {
  item: Item
}

export function PostponeButton({ item }: PostponeButtonProps) {
  return (
    <IconButton
      icon="forward"
      class="item__postpone-button"
      onclick={[Postpone, item.id]}
      disabled={!!item.done}
    />
  )
}
