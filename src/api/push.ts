import { type Item } from "./items"
import { getDB } from "./db"

async function sendChangesToDB({ added, removed, changed }: ChangeSet) {
  const db = getDB()
  await db.bulkDocs([
    ...changed,
    ...added,
    ...removed.map(item => ({ ...item, _deleted: true })),
  ])
}

//finds removals if you just reverse the arguments
function getAdditions(previous: Item[], latest: Item[]) {
  const added: Item[] = []
  const remainder: Item[] = []
  for (let lateItem of latest) {
    if (previous.some(prevItem => prevItem._id === lateItem._id)) {
      remainder.push(lateItem)
    } else {
      added.push(lateItem)
    }
  }
  return [added, remainder]
}

//previous and latest must at this point
//contain items with all the same ids, but
// perhaps differing other properties.
function getDiffingItems(previous: Item[], latest: Item[]) {
  const idSorter = (l: Item, r: Item) =>
    l._id < r._id ? -1 : l._id > r._id ? 1 : 0
  const sortedPrev = [...previous].sort(idSorter)
  const sortedLate = [...latest].sort(idSorter)
  const diffs: Item[] = []
  for (let i = 0; i < sortedPrev.length; i++) {
    const a = sortedPrev[i]
    const b = sortedLate[i]
    // a and b should have the same id
    // here and represent the same item
    const same =
      a.name === b.name &&
      a.done === b.done &&
      a.rank === b.rank &&
      a.postponed === b.postponed &&
      a.repeating === b.repeating
    if (!same) diffs.push(b)
  }
  return diffs
}

function compareChanges(previous: Item[], latest: Item[]): ChangeSet {
  const [added, latest1] = getAdditions(previous, latest)
  const [removed, previous1] = getAdditions(latest1, previous)
  // now previous1 contains only the previous ones that havent
  // been removed, and latest1 contains only the laste ones that
  // werent added. Thus the same ids exist in both lists
  const changed = getDiffingItems(previous1, latest1)
  return { added, removed, changed }
}

type ChangeSet = {
  added: Item[]
  removed: Item[]
  changed: Item[]
}

const changeSetQueue: ChangeSet[] = []
let pumping: boolean = false
async function pumpChangeSet(changeSet: ChangeSet) {
  changeSetQueue.push(changeSet)
  if (pumping) return
  pumping = true
  while (changeSetQueue.length) {
    await sendChangesToDB(changeSetQueue.shift()!)
  }
  pumping = false
}

export function pushChanges(
  _: any,
  options: {
    previous: Item[]
    latest: Item[]
  },
) {
  pumpChangeSet(compareChanges(options.previous, options.latest))
}
