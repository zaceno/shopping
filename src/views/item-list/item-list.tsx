import "webcomponent-transition-group"
import { type State, listItems } from "@/main"
import "./item-list.css"
import { IconButton } from "@/lib/buttons/icon-button"
import {
  type ItemID,
  type Action,
  StopEditing,
  StartEditing,
  InputEditing,
  DragOver,
  ToggleDone,
} from "@/main"
import {
  withEnterKey,
  withTargetValue,
  withFocus,
  withEventProcess,
  type ValidEventAction,
} from "@/lib/event-decorators"
import { withOnOverDragStart } from "@/lib/dragndrop"

const withAnimatedElementOnTop = <S, X>(action: X & ValidEventAction<S, X>) =>
  withEventProcess(event => {
    let prev = document.querySelector("[data-itemtop]")
    if (prev) {
      delete (prev as HTMLElement).dataset.itemtop
    }
    let li = (event.currentTarget! as HTMLButtonElement)
      .parentNode as HTMLLIElement
    li.dataset.itemtop = "top"
    return event
  }, action)

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

type DoneButtonProps = {
  itemID: ItemID
  done: boolean
  disabled?: boolean
}
function ItemDoneButton(props: DoneButtonProps) {
  return (
    <IconButton
      class="item__done-button"
      icon={props.done ? "checked" : "unchecked"}
      onclick={withAnimatedElementOnTop([ToggleDone, props.itemID])}
      active={props.done}
      disabled={props.disabled}
    />
  )
}

function ReorderHandle(props: { disabled: boolean }) {
  return (
    <IconButton
      icon="shuffle"
      class="item__reorder-handle"
      disabled={props.disabled}
      onclick={withOnOverDragStart(
        DragOver as Action<{ draggedID: string; overID: string }>,
      )}
    />
  )
}

type ItemTextProps = {
  id: ItemID
  text: string
  editing: boolean
}
function ItemText(props: ItemTextProps) {
  return props.editing ? (
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
  )
}

type ItemProps = {
  editing: boolean
  done: boolean
  text: string
  id: ItemID
  mode: "normal" | "reorder"
}

export function Item(props: ItemProps) {
  return (
    <li
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
      <ItemText text={props.text} editing={props.editing} id={props.id} />

      {props.mode === "reorder" ? (
        <ReorderHandle disabled={props.done} />
      ) : (
        <ItemDoneButton
          itemID={props.id}
          done={props.done}
          disabled={props.editing}
        />
      )}
    </li>
  )
}

export function ItemList(state: State) {
  let items = listItems(state).map(item => (
    <Item
      id={item.id}
      text={item.name}
      done={item.done > 0}
      editing={item.id === state.editing}
      mode={state.mode}
    />
  ))
  if (state.mode !== "reorder")
    items = <transition-group slide="item--slide">{items}</transition-group>
  return <ul class="item-list">{items}</ul>
}
