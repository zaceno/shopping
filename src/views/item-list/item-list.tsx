import "webcomponent-transition-group"
import { type State, listItems } from "@/main"
import "./item-list.css"
import { Item } from "./item/item"

export function ItemList(state: State) {
  let items = listItems(state).map(item => (
    <Item item={item} mode={state.mode} editing={state.editing === item.id} />
  ))
  if (state.mode !== "reorder")
    items = (
      <transition-group slide="item--slide" exit="item--exit">
        {items}
      </transition-group>
    )
  return <ul class="item-list">{items}</ul>
}
