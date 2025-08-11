import { app } from "hyperapp"
import { init, subscriptions } from "@/main"
import view from "@/views/main"
const node = document.querySelector("#app")
if (!node) throw new Error("mountpoint not found")
export const dispatch = app({ init, view, subscriptions, node })
