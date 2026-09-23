import { type Dispatch, type Action } from "hyperapp"

export function watchOnlineStatus<S>(
  dispatch: Dispatch<S>,
  options: {
    onOnline: Action<S>
    onOffline: Action<S>
  },
) {
  const handleOnline = () => dispatch(options.onOnline)
  const handleOffline = () => dispatch(options.onOffline)
  window.addEventListener("online", handleOnline)
  window.addEventListener("offline", handleOffline)
  return () => {
    window.removeEventListener("online", handleOnline)
    window.removeEventListener("offline", handleOffline)
  }
}