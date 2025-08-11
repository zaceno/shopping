import { Layout } from "@/lib/layout/layout"
import { Toolbar } from "./toolbar"
import { type State } from "@/main"
import { NewEntry } from "./newentry"
import { ItemList } from "./item-list"

export default (state: State) => (
  <Layout
    id="app"
    mainContent={[<NewEntry value={state.newentry} />, <ItemList {...state} />]}
    footerContent={Toolbar(state)}
  />
)

/*export default (state: State) => (
  <main id="app">
    <p>
      <NewEntry value={state.newentry} />
    </p>

    {listItems(state).map(item => (
      <p key={item.id}>
        <Item
          id={item.id}
          text={item.name}
          done={item.done > 0}
          editing={item.id === state.editing}
        />
      </p>
    ))}
  </main>
)
*/
