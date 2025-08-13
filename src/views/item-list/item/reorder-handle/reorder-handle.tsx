import "./reorder-handle.css"
import {
  withOnOverDragStart,
  DATAKEY_ID as REORDERKEY,
} from "@/lib/drag-reorder"
import { type Item, type Action, DragOver } from "@/main"
import { IconButton } from "@/lib/buttons/icon-button"

export function reorderableProps(on: boolean, item: Item) {
  return !on ? {} : { [`data-${REORDERKEY}`]: item.id }
}

export function ReorderHandle({ item }: { item: Item }) {
  return (
    <IconButton
      icon="shuffle"
      class="item__reorder-handle"
      disabled={item.done > 0}
      onclick={withOnOverDragStart(
        DragOver as Action<{ draggedID: string; overID: string }>,
      )}
    />
  )
}
