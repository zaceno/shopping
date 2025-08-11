import "./item.css"
import { ItemEditButton } from "./item-edit-button"
import { ItemDoneButton } from "./item-done-button"
import { ListViewItem, ListViewItemType } from "@/lib/listview/listview"
import { IconButton } from "@/lib/buttons/icon-button"
import {
  type ItemID,
  type Action,
  StopEditing,
  InputEditing,
  DragOver,
} from "@/main"
import { withEnterKey, withTargetValue } from "@/lib/event-decorators"
import { withOnOverDragStart } from "@/lib/dragndrop"

type ReorderHandleProps = {
  done: boolean
}

function ReorderHandle(props: ReorderHandleProps) {
  return (
    <IconButton
      icon="shuffle"
      class="item__reorder-handle"
      disabled={props.done}
      onclick={withOnOverDragStart(
        DragOver as Action<{ draggedID: string; overID: string }>,
      )}
    />
  )
}

type ItemProps = {
  editing: boolean
  done: boolean
  text: string
  id: ItemID
  mode: "normal" | "reorder"
}

export function Item<S>(props: ItemProps): ListViewItemType<S> {
  return (
    <ListViewItem
      key={props.id}
      class={{
        item: true,
        "item--done": props.done,
      }}
      data-dndid={!props.done && props.mode === "reorder" && props.id}
    >
      <ItemEditButton
        focusOnEdit=".item__text-input"
        itemID={props.id}
        editing={props.editing}
        disabled={props.done}
      />
      {props.editing ? (
        <input
          type="text"
          class="item__text-input"
          value={props.text}
          onblur={[StopEditing, props.id]}
          onkeypress={withEnterKey([StopEditing, props.id])}
          oninput={withTargetValue(InputEditing)}
        />
      ) : (
        <span class="item__text">{props.text}</span>
      )}
      {props.mode === "reorder" ? (
        <ReorderHandle done={props.done} />
      ) : (
        <ItemDoneButton
          itemID={props.id}
          done={props.done}
          disabled={props.editing}
        />
      )}
    </ListViewItem>
  )
}
