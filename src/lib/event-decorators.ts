import { type Action } from "hyperapp"
import focuser from "./focuser"

export type ValidEventAction<
  S,
  X,
  E extends Event = Event,
> = X extends readonly [Action<S, infer Z>, any]
  ? readonly [Action<S, Z>, Z]
  : X extends [Action<S, infer Z>, any]
  ? [Action<S, Z>, Z]
  : Action<S, E>

export const withEventProcess =
  <S, X, E extends Event = Event>(
    eventProcessor: (e: E) => void,
    action: X & ValidEventAction<S, X>,
  ): Action<S, E> =>
  (state, event) =>
    [state, , () => eventProcessor(event), dispatch => dispatch(action, event)]

export const withPreventDefault = <S, X>(action: X & ValidEventAction<S, X>) =>
  withEventProcess(event => event.preventDefault(), action)

export const withKeyPress =
  <S, X>(
    key: string,
    action: X & ValidEventAction<S, X>,
  ): Action<S, KeyboardEvent> =>
  (state, event) =>
    [
      state,
      dispatch => {
        if (event.key === key) {
          event.preventDefault()
          dispatch(action, event)
        }
      },
    ]

export const withEnterKey = <S, X>(action: X & ValidEventAction<S, X>) =>
  withKeyPress("Enter", action)

export const withFocus =
  <S, X>(
    selector: string,
    action: X & ValidEventAction<S, X>,
  ): Action<S, Event> =>
  (state, event) =>
    [state, dispatch => dispatch(action, event), focuser(selector)]

export const withTargetValue =
  <S>(action: Action<S, string>): Action<S, Event> =>
  (state, event) =>
    [
      state,
      dispatch => {
        const value = (event.target as HTMLInputElement).value
        dispatch(action, value)
      },
    ]
