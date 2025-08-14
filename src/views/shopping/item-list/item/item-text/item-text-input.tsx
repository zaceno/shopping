import { withEnterKey, withTargetValue } from "@/lib/event-decorators"
import { type ItemID, StopEditing, InputEditing } from "@/main"

type Item = { name: string; id: ItemID }
type ItemProp = { item: Item }
export function ItemTextInput({ item }: ItemProp) {
  return (
    <input
      type="text"
      class="item__text-input"
      value={item.name}
      onblur={[StopEditing, item.id]}
      onkeypress={withEnterKey([StopEditing, item.id])}
      oninput={withTargetValue(InputEditing)}
    />
  )
}
