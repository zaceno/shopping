import "./button.css"
import { type Action, type ClassProp, type MaybeVNode } from "hyperapp"
import { withPreventDefault, MaybeReadonlyTuple } from "@/lib/event-decorators"

export type ButtonProps<S, X> = {
  onclick: Action<S, any> | MaybeReadonlyTuple<Action<S, X>, X>
  class?: ClassProp
  disabled?: boolean
  active?: boolean
}

export function Button<S, X>(
  props: ButtonProps<S, X>,
  content: MaybeVNode<S> | MaybeVNode<S>[],
) {
  const eventhandlers = !!props.disabled
    ? {}
    : {
        ontouchstart: withPreventDefault(props.onclick),
        onmousedown: props.onclick,
      }

  return (
    <button
      class={[
        "button",
        { "button--active": props.active && !props.disabled },
        props.class,
      ]}
      disabled={props.disabled}
      {...eventhandlers}
    >
      {content}
    </button>
  )
}
