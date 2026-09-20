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

export async function checkLogin<S>(
  dispatch: Dispatch<S>,
  options: {
    callback: Action<S, boolean>
  },
) {
  let sessionExists: boolean
  try {
    const response = await fetch("/db/_session", {
      credentials: "include",
    })
    const session = await response.json()
    sessionExists = !!session?.userCtx?.name
  } catch {
    sessionExists = false
  }
  dispatch(options.callback, sessionExists)
}
