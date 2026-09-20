import PouchDB from "pouchdb-browser"

import { type Item } from "./items"

let db: PouchDB.Database<Item> | null = null

function connectDB() {
  db = new PouchDB<Item>("shopping")
  const remote = new PouchDB<Item>(
    new URL("/db/shopping", window.location.origin).href,
  )
  db.sync(remote, { live: true, retry: true })
}

export function getDB() {
  if (!db) connectDB()
  return db as PouchDB.Database<Item>
}
