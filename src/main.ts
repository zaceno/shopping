import { type Action as HpAction } from "hyperapp"
import focuser from "@/lib/focuser"
import { watchLogouts, tryLogin, doLogout, checkLogin } from "@/api/auth"
import { loadItems, pushItemChanges } from "@/api/items"
export type Action<P = any> = HpAction<State, P>
import * as Items from "@/data/items"
export type ItemID = Items.ItemID
export type Item = Items.Item
export type Mode = "normal" | "reorder" | "postpone" | "repeating"
export enum AuthStatus {
  LOGGED_OUT = 0,
  LOGGING_IN = 1,
  LOGGED_IN = 2,
  LOGGING_OUT = 3,
  CHECKING = 4,
}
export enum AuthError {
  NONE = 0,
  NOEMAIL = 1,
  NOPASSWORD = 2,
  INCORRECT = 3,
  SESSIONEND = 4,
}

export type State = {
  auth: AuthStatus
  authError: AuthError
  email: string
  password: string
  mode: Mode
  newentry: string
  items: Items.Item[]
  editing: Items.ItemID | null
  editingInput: string
}

export const init: Action = _ => [
  {
    auth: AuthStatus.CHECKING,
    authError: AuthError.NONE,
    email: "",
    password: "",
    mode: "normal",
    newentry: "",
    items: [],
    editing: null,
    editingInput: "",
  },
  [checkLogin, { callback: CheckLoginResult }],
  focuser(".newentry__input"),
]
export const subscriptions = (state: State) => [
  state.auth === AuthStatus.LOGGED_IN &&
    ([watchLogouts, { callback: WatchLogoutCallback }] as const),
]

const WatchLogoutCallback: Action = state => ({
  ...state,
  auth: AuthStatus.LOGGED_OUT,
  authError: AuthError.SESSIONEND,
})

const CheckLoginResult: Action<boolean> = (_, loggedIn) => {
  if (loggedIn) return LoginSuccessful
  return SetLoggedOut
}

const LoadItems: Action<Item[]> = (state, items) => ({ ...state, items })

export const SetEmail: Action<string> = (state, email) => ({
  ...state,
  email,
})
export const SetPassword: Action<string> = (state, password) => ({
  ...state,
  password,
})

export const LogIn: Action = state => {
  if (state.auth !== AuthStatus.LOGGED_OUT) return state
  if (state.email === "") {
    return { ...state, authError: AuthError.NOEMAIL }
  }
  if (state.password === "") {
    return { ...state, authError: AuthError.NOPASSWORD }
  }
  return [
    { ...state, auth: AuthStatus.LOGGING_IN, authError: AuthError.NONE },
    [
      tryLogin,
      {
        email: state.email,
        password: state.password,
        onOK: LoginSuccessful,
        onFail: LoginFailed,
      },
    ],
  ]
}

const LoginSuccessful: Action = state => [
  {
    ...state,
    auth: AuthStatus.LOGGED_IN,
    authError: AuthError.NONE,
    password: "",
    email: "",
  },
  [loadItems, { callback: LoadItems }],
  focuser(".newentry__input"),
]

const LoginFailed: Action = state => ({
  ...state,
  auth: AuthStatus.LOGGED_OUT,
  password: "",
  authError: AuthError.INCORRECT,
})

export const LogOut: Action = state => {
  if (state.auth !== AuthStatus.LOGGED_IN) return state
  return [
    { ...state, auth: AuthStatus.LOGGING_OUT },
    [doLogout, { onDone: SetLoggedOut }],
  ]
}

const SetLoggedOut: Action = state => ({
  ...state,
  auth: AuthStatus.LOGGED_OUT,
})

export const ToggleDone: Action<Items.ItemID> = (state, id) => {
  const items = Items.toggleDone(state.items, id)
  return [{ ...state, items, editing: null }, [pushItemChanges, items]]
}

export const StartEditing: Action<Items.ItemID> = (state, id) => ({
  ...state,
  editing: id,
})

export const StopEditing: Action<Items.ItemID> = (state, id) => [
  {
    ...state,
    editing: state.editing === id ? null : state.editing,
  },
  [pushItemChanges, state.items],
]

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
  const items = Items.addItem(state.items, state.newentry)
  return [{ ...state, items, newentry: "" }, [pushItemChanges, items]]
}

export const SetMode: Action<State["mode"]> = (state, mode) =>
  mode === state.mode ? state : { ...state, mode, editing: null }

export const ClearDone: Action = state => {
  const items = Items.clearDone(state.items)
  return [
    {
      ...state,
      items,
      editing: null,
    },
    [pushItemChanges, items],
  ]
}

export const countDone = (state: State) => Items.countDone(state.items)

export const listItems = (state: State) => Items.displayList(state.items)

export const DragOver: Action<{ draggedID: ItemID; overID: ItemID }> = (
  state,
  { draggedID, overID },
) => {
  if (state.mode !== "reorder") return state
  const items = Items.moveItemTo(state.items, draggedID, overID)
  return [{ ...state, items }, [pushItemChanges, items]]
}

export const Postpone: Action<ItemID> = (state, id) => {
  const items = Items.postpone(state.items, id)
  return [{ ...state, items }, [pushItemChanges, items]]
}

export const AddPostponed: Action = state => {
  const items = Items.addPostponed(state.items)
  return [{ ...state, items }, [pushItemChanges, items]]
}

export const countPostponed = (state: State) =>
  Items.countPostponed(state.items)

export const AddRepeating: Action = state => {
  const items = Items.restoreRepeating(state.items)
  return [{ ...state, items }, [pushItemChanges, items]]
}

export const countRepeating = (state: State) =>
  Items.countClearedRepeating(state.items)

export const ToggleRepeating: Action<ItemID> = (state, id) => {
  const items = Items.toggleRepeating(state.items, id)
  return [{ ...state, items }, [pushItemChanges, items]]
}

export const isRepeating = (state: State, id: ItemID) =>
  Items.isRepeating(state.items, id)
