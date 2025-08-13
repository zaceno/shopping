import "./item-text.css"
import { ItemTextInput } from "./item-text-input"
import { type Item } from "@/main"

type ItemTextProps = {
  item: Item
  editing: boolean
}

export function ItemText({ item, editing }: ItemTextProps) {
  return editing ? (
    <ItemTextInput item={item} />
  ) : (
    <span class="item__text">{item.name}</span>
  )
}
