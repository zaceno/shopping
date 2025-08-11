import "./listview.css"
import "webcomponent-transition-group"
import { type MaybeVNode, type ClassProp, ElementVNode } from "hyperapp"
import { withEventProcess, ValidEventAction } from "@/lib/event-decorators"

export const withAnimatedElementOnTop = <S, X>(
  action: X & ValidEventAction<S, X>,
) =>
  withEventProcess(event => {
    let prev = document.querySelector("[data-listviewitem-slidetop]")
    if (prev) {
      delete (prev as HTMLElement).dataset.listviewitemSlidetop
    }
    let li = (event.currentTarget! as HTMLButtonElement)
      .parentNode as HTMLLIElement
    li.dataset.listviewitemSlidetop = "top"
    return event
  }, action)

type ListViewItemBrand = { listviewitem: true }
export type ListViewItemType<S> = ElementVNode<S> & ListViewItemBrand
export type ListViewItemProps = {
  key: string
  class?: ClassProp
  [key: `data-${string}`]: string
}
export function ListViewItem<S>(
  props: ListViewItemProps,
  content: MaybeVNode<S> | MaybeVNode<S>[],
) {
  return (
    <li {...props} key={props.key} class={["listview__item", props.class]}>
      {content}
    </li>
  ) as ListViewItemType<S>
}

export type ListViewProps<S, T> = {
  animated?: boolean
  items: T[]
  render: (item: T) => ListViewItemType<S>
}

export function ListView<S, T>(props: ListViewProps<S, T>) {
  const items = props.items.map(item => props.render(item))
  const animatedItems = props.animated ? (
    <transition-group slide="listview__item--slide">{items}</transition-group>
  ) : (
    items
  )
  return <ul class="listview">{animatedItems}</ul>
}
