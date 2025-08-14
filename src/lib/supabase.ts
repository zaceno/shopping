import { type Dispatch, type Action } from "hyperapp"
import { createClient } from "@supabase/supabase-js"

//TODO: remove this
//@ts-ignore
window.mockLogout = async () => {
  supabase.auth.signOut()
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY,
)

export function watchLogouts<S>(
  dispatch: Dispatch<S>,
  options: { callback: Action<S, boolean> },
) {
  const { data } = supabase.auth.onAuthStateChange(event => {
    if (event === "SIGNED_OUT") {
      dispatch(options.callback, false)
    }
  })
  return () => {
    data.subscription.unsubscribe()
  }
}

export async function tryLogin<S>(
  dispatch: Dispatch<S>,
  options: {
    email: string
    password: string
    onOK: Action<S, any>
    onFail: Action<S, any>
  },
) {
  const { error } = await supabase.auth.signInWithPassword({
    email: options.email,
    password: options.password,
  })
  dispatch(!error ? options.onOK : options.onFail)
}

export async function doLogout<S>(
  dispatch: Dispatch<S>,
  options: {
    onDone: Action<S, any>
  },
) {
  await supabase.auth.signOut()
  dispatch(options.onDone)
}

export async function checkLogin<S>(
  dispatch: Dispatch<S>,
  options: {
    callback: Action<S, boolean>
  },
) {
  const { data } = await supabase.auth.getSession()
  dispatch(options.callback, !!data.session)
}

import { type Item } from "@/data/items"
export async function loadItems<S>(
  dispatch: Dispatch<S>,
  options: { callback: Action<S, Item[]> },
) {
  const { data } = await supabase
    .from(import.meta.env.VITE_SHOPPING_TABLE)
    .select("*")
  if (!data) return
  dispatch(options.callback, data as Item[])
}
