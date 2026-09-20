import { type Dispatch, type Action } from "hyperapp"
import { getDB } from "./db"
type ItemIDBrand = { itemID: true }
export type ItemID = string & ItemIDBrand
export enum Repeating {
  NO = "NO",
  YES = "YES",
  CLEARED = "CLEARED",
}
export type Item = {
  _id: ItemID
  _rev?: string
  name: string
  rank: number
  done: number // 0 means not done, > 0 is the rank to display done items
  postponed: boolean
  repeating: Repeating
}

export async function loadItems<S>(
  dispatch: Dispatch<S>,
  options: { callback: Action<S, Item[]> },
) {
  const db = getDB()
  const result = await db.allDocs({
    include_docs: true,
  })
  const items = result.rows.map(row => row.doc as Item)
  dispatch(options.callback, items as Item[])
}
