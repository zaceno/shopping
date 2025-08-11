import "./toolbar.css"
import { Action, ClassProp, MaybeVNode } from "hyperapp"
import { withPreventDefault } from "@/lib/event-decorators"
import { Icon, IconNames } from "@/lib/icons/icon"

export type ToolbarButtonProps<S, X> = {
  icon: IconNames
  label: string
  key: string
  onclick: Action<S, Event> | [Action<S, X>, X]
  active?: boolean
  class?: ClassProp
  disabled?: boolean
  alerts?: number
  style?: "blue" | "red" | "green"
}
export const ToolbarButton = <S, X>(props: ToolbarButtonProps<S, X>) => {
  const eventhandlers = props.disabled
    ? {}
    : {
        ontouchstart: withPreventDefault(props.onclick),
        onmousedown: props.onclick,
      }

  return (
    <button
      disabled={props.disabled}
      class={[
        "toolbar__button",
        {
          "toolbar__button--active": !!props.active,
          "toolbar__button--red": props.style === "red",
          "toolbar__button--green": props.style === "green",
        },
        props.class,
      ]}
      key={props.key}
      {...eventhandlers}
    >
      <Icon name={props.icon} />
      <span class="toolbar__button-text">{props.label}</span>
      {props.alerts && <div class="toolbar__button-alerts">{props.alerts}</div>}
    </button>
  )
}

export const ToolbarSpacer = () => <div class="toolbar__spacer"></div>

export const Toolbar = <S,>(
  _: {},
  content: MaybeVNode<S> | MaybeVNode<S>[],
) => <div class="toolbar">{content}</div>
