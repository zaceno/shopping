import "./item.css"
import { type Item, type Mode } from "@/main"
import { ItemText } from "./item-text/item-text"
import { ItemEditButton } from "./item-edit-button/item-edit-button"
import {
  ReorderHandle,
  reorderableProps,
} from "./reorder-handle/reorder-handle"
import { ToggleDoneButton } from "./toggle-done-button/toggle-done-button"
import { PostponeButton } from "./postpone-button/postpone-button"
type ItemProps = {
  editing: boolean
  mode: Mode
  item: Item
}

export function Item(props: ItemProps) {
  const { editing, mode, item } = props

  return (
    <li
      key={item.id}
      class={{
        item: true,
        "item--done": item.done > 0,
      }}
      {...reorderableProps(mode === "reorder" && !item.done, item)}
    >
      <ItemEditButton item={item} editing={editing} />
      <ItemText item={item} editing={editing} />
      {mode === "reorder" ? (
        <ReorderHandle item={item} />
      ) : mode === "postpone" ? (
        <PostponeButton item={item} />
      ) : (
        <ToggleDoneButton item={item} mode={mode} />
      )}
    </li>
  )
}
