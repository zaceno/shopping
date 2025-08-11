import { type Dispatch } from "hyperapp"
type FocuserOptions = { selector: string }
const _focuser = <S>(_: Dispatch<S>, options: FocuserOptions) => {
  requestAnimationFrame(() => {
    const elem = document.querySelector(options.selector)
    if (!elem) return
    if (!(elem instanceof HTMLInputElement)) return
    elem.focus()
  })
}
export default (selector: string) => [_focuser, { selector }] as const
