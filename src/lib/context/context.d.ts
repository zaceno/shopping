import { type MaybeVNode } from "hyperapp"

type UnresolvedNode<C, S> =
  | MaybeVNode<S>
  | Context<C, S>["use"]
  | Context<C, S>["provide"]
type UnresolvedContent<C, S> = UnresolvedNode<C, S> | UnresolvedNode<C, S>[]
type ResolvedContent<S> = MaybeVNode<S> | MaybeVNode<S>[]
type Resolver<C, S> = (data: C) => ResolvedContent<S>
type Context<C, S> = {
  use: (resolver: Resolver<C, S>) => UnresolvedContent<C, S>
  provide: (data: C, content: UnresolvedContent<C, S>) => ResolvedContent<S>
}
declare function createContext<C, S = any>(): Context<C, S>
