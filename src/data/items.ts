export const RANKSTEP = 10000
type ItemIDBrand = { itemID: true }
export type ItemID = string & ItemIDBrand
export enum Repeating {
  NO = 0,
  YES = 1,
  CLEARED = 2,
}
export type Item = {
  id: ItemID
  name: string
  rank: number
  done: number // 0 means not done, > 0 is the rank to display done items
  postponed: boolean
  repeating: Repeating
}

export const genID = () => crypto.randomUUID() as ItemID

export const getByID = (list: Item[], id: ItemID) => list.find(i => i.id === id)

const findMaxRank = (list: Item[]) =>
  list.reduce((mr, i) => (i.rank < mr ? mr : i.rank), 0)

const findMaxDoneRank = (list: Item[]) =>
  list.reduce((mr, i) => (i.done < mr ? mr : i.done), 0)

export function addItem(list: Item[], name: string): Item[] {
  const rank = findMaxRank(list) + RANKSTEP
  return [
    {
      id: genID(),
      name,
      rank,
      done: 0,
      postponed: false,
      repeating: Repeating.NO,
    },
    ...list,
  ]
}

export function byRank(list: Item[]) {
  const notDone = list.filter(i => !i.done).sort((l, r) => r.rank - l.rank)
  const done = list.filter(i => i.done).sort((l, r) => r.done - l.done)
  return [...notDone, ...done]
}

export function toggleDone(list: Item[], id: ItemID) {
  const item = getByID(list, id)
  const rest = list.filter(i => i.id !== id)
  if (!item) return list
  if (item.postponed) return list
  let newItem = { ...item }
  if (newItem.done > 0) newItem.done = 0
  else newItem.done = findMaxDoneRank(list) + RANKSTEP
  return [newItem, ...rest]
}

const getIndexOfNotDoneItem = (list: Item[], id: ItemID) => {
  const i = list.findIndex(i => i.id === id)
  if (i < 0) throw new Error(`Item with id ${id} not found in list`)
  if (list[i].done > 0)
    throw new Error(`Item with id ${id} is done and cannot move`)
  return i
}

export function moveItemTo(list: Item[], movingID: ItemID, targetID: ItemID) {
  if (movingID === targetID) return list
  const items = byRank(list)
  const movingIndex = getIndexOfNotDoneItem(items, movingID)
  const targetIndex = getIndexOfNotDoneItem(items, targetID)
  const nextIndex = targetIndex + (movingIndex < targetIndex ? 1 : -1)
  const nextRank =
    nextIndex === items.length
      ? 0
      : nextIndex === -1
      ? items[targetIndex].rank + 20000
      : items[nextIndex].rank
  const newRank = Math.round((nextRank + items[targetIndex].rank) / 2)
  items[movingIndex] = { ...items[movingIndex], rank: newRank }
  return items
}

export function clearDone(list: Item[]) {
  return list
    .map(i => {
      if (!i.done) return i
      if (i.repeating === Repeating.CLEARED) return i
      if (i.repeating === Repeating.YES)
        return { ...i, repeating: Repeating.CLEARED }
      return null
    })
    .filter(i => i !== null)
}

export function removeItem(list: Item[], id: ItemID) {
  return list.filter(i => i.id !== id)
}

export function setItemName(list: Item[], id: ItemID, name: string) {
  return list.map(i => (i.id !== id ? i : { ...i, name }))
}

export function rerank(list: Item[]) {
  const ranked = list.sort((l, r) => r.rank - l.rank)
  let rank = list.length * RANKSTEP
  let reranked = []
  for (let item of ranked) {
    reranked.push({
      ...item,
      rank: rank,
    })
    rank = rank - RANKSTEP
  }
  const doneRanked = reranked.sort((l, r) => r.done - l.done)
  let done = list.filter(i => i.done).length * RANKSTEP
  let doneReranked: Item[] = []
  for (let item of doneRanked) {
    let newItem = item
    if (item.done) {
      newItem = { ...item, done: done }
      done = done - RANKSTEP
    }
    doneReranked.push(newItem)
  }
  return doneReranked
}

export function displayList(list: Item[]) {
  return byRank(list).filter(
    i => !i.postponed && i.repeating !== Repeating.CLEARED,
  )
}

export function postpone(list: Item[], id: ItemID) {
  return list.map(item => {
    if (item.id !== id) return item
    if (item.done > 0) return item
    return { ...item, postponed: true }
  })
}

export function addPostponed(list: Item[]) {
  const normal = list.filter(i => !i.postponed)
  const maxNormalRank = normal.reduce((mr, i) => (mr > i.rank ? mr : i.rank), 0)
  const restored = list
    .filter(i => i.postponed)
    .sort((l, r) => l.rank - r.rank)
    .map((i, index) => ({
      ...i,
      postponed: false,
      rank: maxNormalRank + (index + 1) * RANKSTEP,
    }))
  return [...restored, ...normal]
}

export function countPostponed(list: Item[]) {
  return list.filter(i => i.postponed).length
}

export function toggleRepeating(list: Item[], id: ItemID) {
  return list.map(item => {
    if (item.id !== id) return item
    if (item.repeating === Repeating.CLEARED) return item
    return {
      ...item,
      repeating: item.repeating === Repeating.NO ? Repeating.YES : Repeating.NO,
    }
  })
}

export function restoreRepeating(list: Item[]) {
  const noncleared = list.filter(i => i.repeating !== Repeating.CLEARED)
  const maxrank = noncleared.reduce((mr, i) => (mr > i.rank ? mr : i.rank), 0)
  const cleared = list
    .filter(i => i.repeating === Repeating.CLEARED)
    .sort((l, r) => l.rank - r.rank)
    .map((i, index) => ({
      ...i,
      repeating: Repeating.YES,
      rank: maxrank + (index + 1) * RANKSTEP,
      done: 0,
    }))
  return [...cleared, ...noncleared]
}

export function countClearedRepeating(list: Item[]) {
  return list.filter(i => i.repeating === Repeating.CLEARED).length
}

export function countDone(list: Item[]) {
  return list.filter(i => i.done > 0 && i.repeating !== Repeating.CLEARED)
    .length
}

export function isRepeating(list: Item[], id: ItemID) {
  const item = getByID(list, id)
  if (!item) return false
  return item.repeating === Repeating.YES
}
