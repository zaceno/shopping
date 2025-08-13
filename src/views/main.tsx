import "./main.css"
import { Toolbar } from "./toolbar/toolbar"
import { type State } from "@/main"
import { NewEntry } from "./new-entry/new-entry"
import { ItemList } from "./item-list/item-list"

export default (state: State) => (
  <div id="app" class="main__container">
    <main class="main__scrollable-area">
      <NewEntry value={state.newentry} />
      <ItemList {...state} />
    </main>
    <footer class="main__fixed-footer toolbar">
      <Toolbar {...state} />
    </footer>
  </div>
)
