import { type Action as HpAction } from "hyperapp"
import focuser from "@/lib/focuser"
import {
  checkLogin,
  tryLogin,
  doLogout,
  type SessionState,
} from "@/api/auth"
import { watchOnlineStatus } from "@/api/online"
import { loadItems } from "@/api/items"
import { subscribeChanges } from "@/api/changes"
import { pushChanges } from "./api/push"
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
  OFFLINE = 5,
}
export enum AuthError {
  NONE = 0,
  NOUSERNAME = 1,
  NOPASSWORD = 2,
  INCORRECT = 3,
  SESSIONEND = 4,
}

export type State = {
  auth: AuthStatus
  authError: AuthError
  username: string
  password: string
  mode: Mode
  newentry: string
  items: Items.Item[]
  editing: Items.ItemID | null
  editingInput: string
}

const _withItemChanges_doSend: Action<Item[]> = (state, previous) => [
  state,
  [pushChanges, { previous, latest: state.items }],
]
const withItemChanges =
  <P>(action: Action<P>): Action<P> =>
  (state, payload) =>
    [
      state,
      dispatch => dispatch(action, payload),
      dispatch => dispatch(_withItemChanges_doSend, state.items),
    ]

export const init: Action = _ => {
  return [
    {
      auth: AuthStatus.CHECKING,
      authError: AuthError.NONE,
      username: "",
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
}
export const subscriptions = (state: State) => [
  (state.auth === AuthStatus.LOGGED_IN ||
    state.auth === AuthStatus.OFFLINE) &&
    ([
      subscribeChanges,
      {
        onUpsert: RemoteUpsert,
        onDelete: RemoteDelete,
      },
    ] as const),
  ([
    watchOnlineStatus,
    {
      onOnline: RecheckLogin,
      onOffline: GoOffline,
    },
  ] as const),
]

const RemoteUpsert: Action<Item> = (state, item) => {
  const index = state.items.findIndex(i => i._id === item._id)
  if (index >= 0) {
    const items = [...state.items]
    items[index] = item
    return { ...state, items }
  } else {
    return { ...state, items: [...state.items, item] }
  }
}

const RemoteDelete: Action<ItemID> = (state, deletedID) => {
  if (!state.items.find(i => i._id === deletedID)) return state
  return { ...state, items: state.items.filter(i => i._id !== deletedID) }
}

// const WatchLogoutCallback: Action = state => ({
//   ...state,
//   auth: AuthStatus.LOGGED_OUT,
//   authError: AuthError.SESSIONEND,
// })

const CheckLoginResult: Action<SessionState> = (_, result) => {
  if (result === "logged-in") return LoginSuccessful
  if (result === "offline") return GoOffline
  return SetLoggedOut
}

const GoOffline: Action = state => {
  if (
    state.auth !== AuthStatus.LOGGED_OUT &&
    state.auth !== AuthStatus.CHECKING &&
    state.auth !== AuthStatus.LOGGING_IN
  ) {
    return state
  }
  return [
    { ...state, auth: AuthStatus.OFFLINE, authError: AuthError.NONE },
    [loadItems, { callback: LoadItems }],
    focuser(".newentry__input"),
  ]
}

const RecheckLogin: Action = state => {
  if (state.auth !== AuthStatus.OFFLINE) return state
  return [state, [checkLogin, { callback: CheckLoginResult }]]
}
//
const LoadItems: Action<Item[]> = (state, items) => ({ ...state, items })

export const SetUsername: Action<string> = (state, username) => ({
  ...state,
  username,
})
export const SetPassword: Action<string> = (state, password) => ({
  ...state,
  password,
})

export const LogIn: Action = state => {
  if (state.auth !== AuthStatus.LOGGED_OUT) return state
  if (state.username === "") {
    return { ...state, authError: AuthError.NOUSERNAME }
  }
  if (state.password === "") {
    return { ...state, authError: AuthError.NOPASSWORD }
  }
  return [
    { ...state, auth: AuthStatus.LOGGING_IN, authError: AuthError.NONE },
    [
      tryLogin,
      {
        username: state.username,
        password: state.password,
        onOK: LoginSuccessful,
        onFail: LoginFailed,
      },
    ],
  ]
}

const LoginSuccessful: Action = state => {
  return [
    {
      ...state,
      auth: AuthStatus.LOGGED_IN,
      authError: AuthError.NONE,
      password: "",
      name: "",
    },
    [loadItems, { callback: LoadItems }],
    focuser(".newentry__input"),
  ]
}

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

export const ToggleDone: Action<Items.ItemID> = withItemChanges(
  (state, id) => ({
    ...state,
    items: Items.toggleDone(state.items, id),
    editing: null,
  }),
)

export const StartEditing: Action<Items.ItemID> = (state, id) => ({
  ...state,
  editing: id,
})

export const StopEditing: Action<Items.ItemID> = withItemChanges(
  (state, id) => ({
    ...state,
    editing: state.editing === id ? null : state.editing,
  }),
)

export const InputEditing: Action<string> = withItemChanges((state, text) =>
  !state.editing
    ? state
    : { ...state, items: Items.setItemName(state.items, state.editing, text) })

export const InputNewEntry: Action<string> = (state, newentry) => ({
  ...state,
  newentry,
})

export const AddNewItem: Action<any> = withItemChanges(state => {
  if (!state.newentry) return state
  const items = Items.addItem(state.items, state.newentry)
  return { ...state, items, newentry: "" }
})

export const SetMode: Action<State["mode"]> = (state, mode) =>
  mode === state.mode ? state : { ...state, mode, editing: null }

export const ClearDone: Action = withItemChanges(state => ({
  ...state,
  items: Items.clearDone(state.items),
  editing: null,
}))

export const countDone = (state: State) => Items.countDone(state.items)

export const listItems = (state: State) => Items.displayList(state.items)

export const DragOver: Action<{ draggedID: ItemID; overID: ItemID }> =
  withItemChanges((state, { draggedID, overID }) => {
    if (state.mode !== "reorder") return state
    return { ...state, items: Items.moveItemTo(state.items, draggedID, overID) }
  })

export const Postpone: Action<ItemID> = withItemChanges((state, id) => ({
  ...state,
  items: Items.postpone(state.items, id),
}))

export const AddPostponed: Action = withItemChanges(state => ({
  ...state,
  items: Items.addPostponed(state.items),
}))

export const countPostponed = (state: State) =>
  Items.countPostponed(state.items)

export const AddRepeating: Action = withItemChanges(state => ({
  ...state,
  items: Items.restoreRepeating(state.items),
}))

export const countRepeating = (state: State) =>
  Items.countClearedRepeating(state.items)

export const ToggleRepeating: Action<ItemID> = withItemChanges((state, id) => ({
  ...state,
  items: Items.toggleRepeating(state.items, id),
}))

export const isRepeating = (state: State, id: ItemID) =>
  Items.isRepeating(state.items, id)
