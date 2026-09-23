import { type Dispatch, type Action } from "hyperapp"
// export function watchLogouts<S>(
//   dispatch: Dispatch<S>,
//   options: { callback: Action<S, boolean> },
// ) {
//   const { data } = supabase.auth.onAuthStateChange(event => {
//     if (event === "SIGNED_OUT") {
//       dispatch(options.callback, false)
//     }
//   })
//   return () => {
//     data.subscription.unsubscribe()
//   }
// }
//
export async function tryLogin<S>(
  dispatch: Dispatch<S>,
  options: {
    username: string
    password: string
    onOK: Action<S, any>
    onFail: Action<S, any>
  },
) {
  try {
    const response = await fetch("/db/_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: options.username,
        password: options.password,
      }),
    })
    if (!response.ok) {
      throw new Error("Invalid username or password")
    }
    dispatch(options.onOK)
  } catch (e) {
    dispatch(options.onFail)
  }
}

export async function doLogout<S>(
  dispatch: Dispatch<S>,
  options: {
    onDone: Action<S, any>
  },
) {
  await fetch("/db/_session", {
    method: "DELETE",
    credentials: "include",
  })
  dispatch(options.onDone)
}

export type SessionState = "logged-in" | "logged-out" | "offline"

export async function checkLogin<S>(
  dispatch: Dispatch<S>,
  options: {
    callback: Action<S, SessionState>
  },
) {
  let sessionState: SessionState = "offline"
  try {
    const response = await fetch("/db/_session", {
      credentials: "include",
    })
    const session = (await response.json()) as {
      userCtx?: { name?: string | null }
    }
    // Only trust a real CouchDB _session payload. A proxy that can't reach the
    // backend answers with a non-JSON error page, which means we're effectively
    // offline even though the fetch itself resolved.
    if (response.ok && session?.userCtx) {
      sessionState = session.userCtx.name ? "logged-in" : "logged-out"
    }
  } catch {
    sessionState = "offline"
  }
  dispatch(options.callback, sessionState)
}
