import { type Action as HpAction } from "hyperapp"
import focuser from "@/lib/focuser"
export type Action<P = any> = HpAction<State, P>
import * as Items from "@/data/items"

export type ItemID = Items.ItemID

export type State = {
  mode: "normal" | "reorder" | "postpone" | "repeating"
  newentry: string
  items: Items.Item[]
  editing: Items.ItemID | null
  editingInput: string
}

export const init: Action = _ => [
  {
    mode: "normal",
    newentry: "",
    items: Items.addItem(
      Items.addItem(
        Items.addItem(
          Items.addItem([], "cheese flavored nachos"),
          "ground beef",
        ),
        "milk, 5l",
      ),
      "a bunch of asparagus",
    ),
    editing: null,
    editingInput: "",
  },
  focuser(".newentry__input"),
]

export const ToggleDone: Action<Items.ItemID> = (state, id) => ({
  ...state,
  editing: null,
  items: Items.toggleDone(state.items, id),
})

export const StartEditing: Action<Items.ItemID> = (state, id) => ({
  ...state,
  editing: id,
})

export const StopEditing: Action<Items.ItemID> = (state, id) => ({
  ...state,
  editing: state.editing === id ? null : state.editing,
})

export const InputEditing: Action<string> = (state, text) =>
  !state.editing
    ? state
    : { ...state, items: Items.setItemName(state.items, state.editing, text) }

export const InputNewEntry: Action<string> = (state, newentry) => ({
  ...state,
  newentry,
})
export const AddNewItem: Action<any> = state => {
  if (!state.newentry) return state
  return {
    ...state,
    items: Items.addItem(state.items, state.newentry),
    newentry: "",
  }
}

export const SetMode: Action<State["mode"]> = (state, mode) =>
  mode === state.mode ? state : { ...state, mode, editing: null }

export const ClearDone: Action = state => ({
  ...state,
  editing: null,
  items: Items.clearDone(state.items),
})

export const countDone = (state: State) => Items.countDone(state.items)

export const listItems = (state: State) => Items.displayList(state.items)

export const DragOver: Action<{ draggedID: ItemID; overID: ItemID }> = (
  state,
  { draggedID, overID },
) => {
  if (state.mode !== "reorder") return state
  return {
    ...state,
    items: Items.moveItemTo(state.items, draggedID, overID),
  }
}

export const subscriptions = (_state: State) => [
  // state.mode === "reorder" && [dragndrop, { onOver: DragOver }]
]
