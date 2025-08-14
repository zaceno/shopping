import "./toggle-repeating-button.css"
import { type State, type Item, ToggleRepeating, isRepeating } from "@/main"
import { IconButton } from "@/lib/buttons/icon-button"

type ToggleRepeatingButtonProps = {
  state: State
  item: Item
}

export function ToggleRepeatingButton({
  state,
  item,
}: ToggleRepeatingButtonProps) {
  return (
    <IconButton
      icon="repeat"
      active={isRepeating(state, item.id)}
      class="item__repeating-button"
      onclick={[ToggleRepeating, item.id]}
      disabled={!!item.done}
    />
  )
}
