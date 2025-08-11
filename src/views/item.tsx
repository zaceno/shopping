import "./item.css"
import { ItemEditButton } from "./item-edit-button"
import { ItemDoneButton } from "./item-done-button"
import { ListViewItem, ListViewItemType } from "@/lib/listview/listview"
import { IconButton } from "@/lib/buttons/icon-button"
import {
  type State,
  type ItemID,
  makeDragReorderable,
  StopEditing,
  InputEditing,
} from "@/main"
import { withEnterKey, withTargetValue } from "@/lib/event-decorators"

type ReorderableItemProps = {
  text: string
  id: ItemID
  done?: boolean
}

export function ReorderableItem(props: ReorderableItemProps) {
  const node = (
    <ListViewItem
      key={props.id}
      class={{ item: true, "item--done": props.done }}
    >
      <IconButton
        icon="pen"
        disabled={true}
        onclick={(state: State) => state}
      />
      <span class="item__text">{props.text}</span>
      <IconButton icon="shuffle" onclick={(state: State) => state} />
    </ListViewItem>
  )
  return (
    props.done ? node : makeDragReorderable(props.id, node)
  ) as ListViewItemType<State>
}

type ItemProps = {
  editing: boolean
  done: boolean
  text: string
  id: ItemID
}

export function Item<S>(props: ItemProps): ListViewItemType<S> {
  return (
    <ListViewItem
      key={props.id}
      class={{
        item: true,
        "item--done": props.done,
      }}
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
      <ItemDoneButton
        itemID={props.id}
        done={props.done}
        disabled={props.editing}
      />
    </ListViewItem>
  )
}
