import { supabase } from "./supabase"
import { type Item, ItemID } from "@/data/items"
import { type Dispatch, type Action } from "hyperapp"
type ChangeKind = "insert" | "remove" | "update"
type Change = { kind: ChangeKind; item: Item }

const ITEMTABLE = import.meta.env.VITE_SHOPPING_TABLE

let running = false
const queue: Change[] = []

async function insertItem(item: Item) {
  console.log("inserting", item)
  return await supabase.from(ITEMTABLE).insert(item)
}

async function removeItem(item: Item) {
  console.log("deleting", item)
  return await supabase.from(ITEMTABLE).delete().eq("id", item.id)
}

async function updateItem(item: Item) {
  console.log("udpating", item)
  return await supabase.from(ITEMTABLE).update(item).eq("id", item.id)
}

async function pump() {
  // get the next item
  let change = queue.shift()

  // if no item gotten, it means
  // the queue is empty: stop processing
  if (!change) {
    // tells queueChange that processing
    // will need to be started next time
    // a change comes in:
    console.log("queue empty - processing halted")
    running = false
    return
  }

  console.log("processing", change)
  // send the appropriate change
  const { kind, item } = change
  if (kind === "insert") {
    await insertItem(item)
  } else if (kind === "remove") {
    await removeItem(item)
  } else {
    await updateItem(item)
  }

  // wait until next best
  // time to send another
  // change
  setTimeout(pump, 0)
}

export function queueChange(kind: ChangeKind, item: Item) {
  // add item to queue
  queue.push({ kind, item })
  console.log("pushing change", kind, item)
  if (!running) {
    // since we aren't already,
    // start processing changes
    running = true
    setTimeout(pump, 0)
  }
}

let currentItemMap: null | Record<ItemID, Item> = null

function makeItemMap(items: Item[]) {
  return Object.fromEntries(items.map(item => [item.id, item])) as Record<
    ItemID,
    Item
  >
}

export async function loadItems<S>(
  dispatch: Dispatch<S>,
  options: { callback: Action<S, Item[]> },
) {
  const { data } = await supabase
    .from(import.meta.env.VITE_SHOPPING_TABLE)
    .select("*")
  if (!data) return
  currentItemMap = makeItemMap(data as Item[])
  dispatch(options.callback, data as Item[])
}

let updateCallbackID: NodeJS.Timeout | null = null

function registerChanges(newItems: Item[]) {
  if (!currentItemMap) return null
  console.log("IDENTIFYING CHANGES")
  const newMap = makeItemMap(newItems)
  for (let id in currentItemMap) {
    if (!(id in newMap)) {
      queueChange("remove", currentItemMap[id as ItemID])
    }
  }
  for (let id in newMap) {
    if (!(id in currentItemMap)) {
      queueChange("insert", newMap[id as ItemID])
    } else {
      let o = currentItemMap[id as ItemID]
      let n = newMap[id as ItemID]
      if (
        o.name !== n.name ||
        o.rank !== n.rank ||
        o.done !== n.done ||
        o.postponed !== n.postponed ||
        o.repeating !== n.repeating
      ) {
        queueChange("update", n)
      }
    }
  }
  return newMap
}

export function pushItemChanges(_: any, items: Item[]) {
  console.log("NOTIFY CHANGES", items.length)
  if (!currentItemMap) return
  if (!!updateCallbackID) clearTimeout(updateCallbackID)
  updateCallbackID = setTimeout(() => {
    updateCallbackID = null
    currentItemMap = registerChanges(items)
  }, 1000)
}
