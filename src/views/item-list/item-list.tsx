import "webcomponent-transition-group"
import { type State, listItems } from "@/main"
import "./item-list.css"
import { Item } from "./item/item"

export function ItemList(state: State) {
  let items = listItems(state).map(item => <Item item={item} state={state} />)
  if (state.mode !== "reorder")
    items = (
      <transition-group
        slide="item--slide"
        {...(state.mode === "postpone" ? { exit: "item--exit" } : {})}
      >
        {items}
      </transition-group>
    )
  return <ul class="item-list">{items}</ul>
}
