import type { Dispatch, Action } from "hyperapp"
import { type Item, type ItemID } from "./items"
import { getDB } from "./db"

type SubscribeChangesOptions<S> = {
  onUpsert: Action<S, Item>
  onDelete: Action<S, ItemID>
}
export function subscribeChanges<S>(
  dispatch: Dispatch<S>,
  options: SubscribeChangesOptions<S>,
) {
  const db = getDB()
  const changes = db.changes({
    live: true,
    since: "now",
    include_docs: true,
  })

  changes.on("change", change => {
    const doc = change.doc
    if (!doc) return
    if (doc._deleted) {
      return dispatch(options.onDelete, doc._id)
    }
    dispatch(options.onUpsert, doc as Item)
  })
  return () => {
    changes.cancel()
  }
}
