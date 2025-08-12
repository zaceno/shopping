import { Layout } from "@/lib/layout/layout"
import { Toolbar } from "./toolbar"
import { type State } from "@/main"
import { NewEntry } from "./newentry"
import { ItemList } from "./item-list/item-list"

export default (state: State) => (
  <Layout
    id="app"
    mainContent={[<NewEntry value={state.newentry} />, <ItemList {...state} />]}
    footerContent={Toolbar(state)}
  />
)
