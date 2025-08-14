import "./toggle-done.button.css"
import {
  type Item,
  type Mode,
  type Action,
  type ItemID,
  ToggleDone,
} from "@/main"
import { withEventProcess } from "@/lib/event-decorators"
import { IconButton } from "@/lib/buttons/icon-button"

const withAnimatedElementOnTop = (action: [Action<ItemID>, ItemID]) =>
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

type ToggleDoneButtonProps = {
  item: Item
  mode: Mode
}

export function ToggleDoneButton(props: ToggleDoneButtonProps) {
  const id = props.item.id
  const isDone = props.item.done > 0
  const normalMode = props.mode === "normal"
  const isDisabled = isDone && !normalMode
  return (
    <IconButton
      class="item__done-button"
      icon={isDone ? "checked" : "unchecked"}
      onclick={withAnimatedElementOnTop([ToggleDone, id])}
      active={isDone}
      disabled={isDisabled}
    />
  )
}
