import "./layout.css"
import { type MaybeVNode } from "hyperapp"

type LayoutProps<S> = {
  id?: string
  mainContent: MaybeVNode<S> | MaybeVNode<S>[]
  footerContent: MaybeVNode<S> | MaybeVNode<S>[]
}

export function Layout<S>(props: LayoutProps<S>) {
  return (
    <div {...(props.id ? { id: props.id } : {})} class="layout__container">
      <main class="layout__content">{props.mainContent}</main>
      <footer class="layout__footer toolbar">{props.footerContent}</footer>
    </div>
  )
}
