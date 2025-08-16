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
    console.log("event", payload)
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
      console.log("found session", res.data.session!)
      if (!!res.data.session) return res.data.session!
    })
    .then(session => {
      console.log("setting realtime auth token", session!.access_token)
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
        .subscribe(status => {
          console.log("SUBSCRIBED", status)
        })
    })

  return () => {
    !!channel && channel.unsubscribe()
  }
}
