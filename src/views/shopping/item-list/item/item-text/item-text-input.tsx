import { withEnterKey, withTargetValue } from "@/lib/event-decorators"
import { type Item, StopEditing, InputEditing } from "@/main"

type ItemProp = { item: Item }
export function ItemTextInput({ item }: ItemProp) {
  return (
    <input
      type="text"
      class="item__text-input"
      value={item.name}
      onblur={[StopEditing, item._id]}
      onkeypress={withEnterKey([StopEditing, item._id])}
      oninput={withTargetValue(InputEditing)}
    />
  )
}
