import { type State, listItems } from "@/main"
import { Item, ReorderableItem } from "./item"
import { ListView } from "@/lib/listview/listview"

export function ItemList(state: State) {
  return (
    <ListView
      animated={state.mode === "normal"}
      items={listItems(state)}
      render={item =>
        state.mode === "reorder" ? (
          <ReorderableItem id={item.id} text={item.name} done={item.done > 0} />
        ) : (
          <Item
            id={item.id}
            text={item.name}
            done={item.done > 0}
            editing={item.id === state.editing}
          />
        )
      }
    />
  )
}
