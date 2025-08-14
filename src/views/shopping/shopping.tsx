import "./shopping.css"
import { Toolbar } from "./toolbar/toolbar"
import { type State } from "@/main"
import { NewEntry } from "./new-entry/new-entry"
import { ItemList } from "./item-list/item-list"

export function Shopping({ state }: { state: State }) {
  return (
    <>
      <main class="shopping__scrollable-area">
        <NewEntry value={state.newentry} />
        <ItemList {...state} />
      </main>
      <footer class="shopping__footer">
        <Toolbar {...state} />
      </footer>
    </>
  )
}
