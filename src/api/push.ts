import { type Item } from "./items"
const DEBOUNCE_TIME = 1000

function compareChanges(previous, latest) {}

const delayedChanges = (() => {
  let delay: Timeout | null = null
  return function (previous: Item[], latest: Item[]) {
    if (delay !== null) clearTimeout(delay)
    delay = setTimeout(() => {
      delay = null
      compareChanges(previous, latest)
    }, DEBOUNCE_TIME) as unknown as Timeout
  }
})()

export function pushChanges(
  _: any,
  options: {
    previous: Item[]
    latest: Item[]
  },
) {
  delayedChanges(options.previous, options.latest)
}
