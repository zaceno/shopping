import { type Item, type ItemID } from "@/data/items"
import { type Dispatch, type Action } from "hyperapp"
import { supabase } from "./supabase"

type SubscribeChangesOptions<S> = {
  onInsert: Action<S, Item>
  onUpdate: Action<S, Item>
  onDelete: Action<S, ItemID>
}

export function subscribeChanges<S>(
  dispatch: Dispatch<S>,
  options: SubscribeChangesOptions<S>,
) {
  const handlePayload = (payload: {
    new: Item
    old: Item
    eventType: "INSERT" | "UPDATE" | "DELETE"
  }) => {
    if (payload.eventType === "INSERT") {
      dispatch(options.onInsert, payload.new)
    } else if (payload.eventType === "UPDATE") {
      dispatch(options.onUpdate, payload.new)
    } else if (payload.eventType === "DELETE") {
      dispatch(options.onDelete, payload.old.id as ItemID)
    }
  }

  let channel: null | { unsubscribe: () => void } = null

  supabase.auth
    .getSession()
    .then(res => {
      if (!!res.data.session) return res.data.session!
    })
    .then(session => {
      supabase.realtime.setAuth(session!.access_token)
    })
    .then(() => {
      channel = supabase
        .channel("shopping-changes")
        .on(
          //@ts-ignore
          "postgres_changes",
          { event: "*", schema: "public", table: "shopping" },
          handlePayload,
        )
        .subscribe()
    })

  return () => {
    !!channel && channel.unsubscribe()
  }
}
