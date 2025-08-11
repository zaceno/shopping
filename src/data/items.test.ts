import { expect, test } from "vitest"
import {
  addItem,
  genID,
  RANKSTEP,
  toggleDone,
  getByID,
  byRank,
  moveItemTo,
  clearDone,
  removeItem,
  setItemName,
  rerank,
  postpone,
  displayList,
  addPostponed,
  countPostponed,
  toggleRepeating,
  restoreRepeating,
  countClearedRepeating,
  Repeating,
  type Item,
  type ItemID,
} from "./items"

test("add new item to empty list", () => {
  const NAME = "foo bar baz"
  const result = addItem([], NAME)
  expect(result.length).toBe(1)
  const newItem = result[0]
  expect(typeof newItem.id).toBe("string")
  expect(newItem.id).toBeTruthy()
  expect(newItem.name).toBe(NAME)
  expect(newItem.rank).toBe(RANKSTEP)
  expect(newItem.done).toBe(0)
})

test("new item added to populated list", () => {
  const NEWNAME = "newname"
  const item1 = { id: genID(), name: "foo", rank: 30000, done: 0 }
  const item2 = { id: genID(), name: "bar", rank: 70000, done: 0 }
  const item3 = { id: genID(), name: "baz", rank: 50000, done: 0 }
  const omaxrank = 70000
  const olist = [item1, item2, item3] as Item[]
  const nlist = addItem(olist, NEWNAME)
  expect(nlist.length).toBe(4)
  const newItem = nlist.find(i => i.name === NEWNAME)
  expect(newItem).toBeTruthy()
  expect(newItem!.done).toBe(0)
  expect(newItem!.rank).toBe(omaxrank + RANKSTEP)
})

test("toggle done item", () => {
  let list: Item[] = []
  list = addItem(list, "foo")
  list = addItem(list, "bar")
  list = addItem(list, "baz")
  const fooID = list.find(i => i.name === "foo")!.id
  const barID = list.find(i => i.name === "bar")!.id
  const bazID = list.find(i => i.name === "baz")!.id
  list = toggleDone(list, barID)
  expect(getByID(list, barID)!.done).toBeGreaterThan(0)
  list = toggleDone(list, fooID)
  expect(getByID(list, fooID)!.done).toBeGreaterThan(0)
  list = toggleDone(list, bazID)
  expect(getByID(list, bazID)!.done).toBeGreaterThan(0)
  list = toggleDone(list, barID)
  expect(getByID(list, barID)!.done).toBe(0)
})

test("toggle done ranks done items in order of last done first", () => {
  let list: Item[] = []
  list = addItem(list, "foo")
  list = addItem(list, "bar")
  list = addItem(list, "baz")
  const fooID = list.find(i => i.name === "foo")!.id
  const barID = list.find(i => i.name === "bar")!.id
  const bazID = list.find(i => i.name === "baz")!.id
  list = toggleDone(list, barID)
  list = toggleDone(list, fooID)
  list = toggleDone(list, bazID)
  list = byRank(list)
  expect(list.map(i => i.name)).toEqual(["baz", "foo", "bar"])
})

test("toggle done back to undone restores original rank", () => {
  let list: Item[] = []
  list = addItem(list, "foo")
  list = addItem(list, "bar")
  list = addItem(list, "baz")
  const fooID = list.find(i => i.name === "foo")!.id
  const barID = list.find(i => i.name === "bar")!.id
  const bazID = list.find(i => i.name === "baz")!.id
  list = toggleDone(list, barID)
  list = toggleDone(list, fooID)
  list = toggleDone(list, bazID)
  list = toggleDone(list, barID)
  list = toggleDone(list, fooID)
  list = toggleDone(list, bazID)
  list = byRank(list)
  expect(list.map(i => i.name)).toEqual(["baz", "bar", "foo"])
})

test("move to self", () => {
  let list: Item[] = []
  list = addItem(list, "foo")
  list = addItem(list, "bar")
  list = addItem(list, "baz")
  const itemID = list.find(i => i.name === "bar")!.id
  list = moveItemTo(list, itemID, itemID)
  expect(list).toBe(list)
})

test("two items - move top down", () => {
  let list: Item[] = []
  list = addItem(list, "foo")
  list = addItem(list, "bar")
  const topID = list.find(i => i.name === "bar")!.id
  const bottomID = list.find(i => i.name === "foo")!.id
  list = moveItemTo(list, topID, bottomID)
  expect(byRank(list).map(i => i.name)).toEqual(["foo", "bar"])
})

test("two items - move bottom up", () => {
  let list: Item[] = []
  list = addItem(list, "foo")
  list = addItem(list, "bar")
  const topID = list.find(i => i.name === "bar")!.id
  const bottomID = list.find(i => i.name === "foo")!.id
  list = moveItemTo(list, bottomID, topID)
  expect(byRank(list).map(i => i.name)).toEqual(["foo", "bar"])
})

test("long list move middle to top", () => {
  let list: Item[] = []
  list = addItem(list, "ten")
  const tenID = list.find(i => i.name === "ten")!.id
  list = addItem(list, "nine")
  const nineID = list.find(i => i.name === "nine")!.id
  list = addItem(list, "eight")
  const eightID = list.find(i => i.name === "eight")!.id
  list = addItem(list, "seven")
  const sevenID = list.find(i => i.name === "seven")!.id
  list = addItem(list, "six")
  const sixID = list.find(i => i.name === "six")!.id
  list = addItem(list, "five")
  const fiveID = list.find(i => i.name === "five")!.id
  list = addItem(list, "four")
  const fourID = list.find(i => i.name === "four")!.id
  list = addItem(list, "three")
  const threeID = list.find(i => i.name === "three")!.id
  list = addItem(list, "two")
  const twoID = list.find(i => i.name === "two")!.id
  list = addItem(list, "one")
  const oneID = list.find(i => i.name === "one")!.id
  list = toggleDone(list, tenID)
  list = toggleDone(list, nineID)
  list = toggleDone(list, eightID)

  list = moveItemTo(list, fourID, oneID)
  expect(byRank(list).map(i => i.id)).toEqual([
    fourID,
    oneID,
    twoID,
    threeID,
    fiveID,
    sixID,
    sevenID,
    eightID,
    nineID,
    tenID,
  ])
})

test("long list move middle to bottom", () => {
  let list: Item[] = []
  list = addItem(list, "seven")
  const sevenID = list.find(i => i.name === "seven")!.id
  list = addItem(list, "six")
  const sixID = list.find(i => i.name === "six")!.id
  list = addItem(list, "five")
  const fiveID = list.find(i => i.name === "five")!.id
  list = addItem(list, "four")
  const fourID = list.find(i => i.name === "four")!.id
  list = addItem(list, "three")
  const threeID = list.find(i => i.name === "three")!.id
  list = addItem(list, "two")
  const twoID = list.find(i => i.name === "two")!.id
  list = addItem(list, "one")
  const oneID = list.find(i => i.name === "one")!.id

  list = moveItemTo(list, fourID, sevenID)
  expect(byRank(list).map(i => i.id)).toEqual([
    oneID,
    twoID,
    threeID,
    fiveID,
    sixID,
    sevenID,
    fourID,
  ])
})

test("long list move middle up", () => {
  let list: Item[] = []
  list = addItem(list, "ten")
  const tenID = list.find(i => i.name === "ten")!.id
  list = addItem(list, "nine")
  const nineID = list.find(i => i.name === "nine")!.id
  list = addItem(list, "eight")
  const eightID = list.find(i => i.name === "eight")!.id
  list = addItem(list, "seven")
  const sevenID = list.find(i => i.name === "seven")!.id
  list = addItem(list, "six")
  const sixID = list.find(i => i.name === "six")!.id
  list = addItem(list, "five")
  const fiveID = list.find(i => i.name === "five")!.id
  list = addItem(list, "four")
  const fourID = list.find(i => i.name === "four")!.id
  list = addItem(list, "three")
  const threeID = list.find(i => i.name === "three")!.id
  list = addItem(list, "two")
  const twoID = list.find(i => i.name === "two")!.id
  list = addItem(list, "one")
  const oneID = list.find(i => i.name === "one")!.id
  list = toggleDone(list, tenID)
  list = toggleDone(list, nineID)
  list = toggleDone(list, eightID)

  list = moveItemTo(list, fourID, threeID)
  expect(byRank(list).map(i => i.id)).toEqual([
    oneID,
    twoID,
    fourID,
    threeID,
    fiveID,
    sixID,
    sevenID,
    eightID,
    nineID,
    tenID,
  ])
})

test("long list move middle down", () => {
  let list: Item[] = []
  list = addItem(list, "ten")
  const tenID = list.find(i => i.name === "ten")!.id
  list = addItem(list, "nine")
  const nineID = list.find(i => i.name === "nine")!.id
  list = addItem(list, "eight")
  const eightID = list.find(i => i.name === "eight")!.id
  list = addItem(list, "seven")
  const sevenID = list.find(i => i.name === "seven")!.id
  list = addItem(list, "six")
  const sixID = list.find(i => i.name === "six")!.id
  list = addItem(list, "five")
  const fiveID = list.find(i => i.name === "five")!.id
  list = addItem(list, "four")
  const fourID = list.find(i => i.name === "four")!.id
  list = addItem(list, "three")
  const threeID = list.find(i => i.name === "three")!.id
  list = addItem(list, "two")
  const twoID = list.find(i => i.name === "two")!.id
  list = addItem(list, "one")
  const oneID = list.find(i => i.name === "one")!.id
  list = toggleDone(list, tenID)
  list = toggleDone(list, nineID)
  list = toggleDone(list, eightID)

  list = moveItemTo(list, fourID, fiveID)
  expect(byRank(list).map(i => i.id)).toEqual([
    oneID,
    twoID,
    threeID,
    fiveID,
    fourID,
    sixID,
    sevenID,
    eightID,
    nineID,
    tenID,
  ])
})

test("cannot move to done items", () => {
  let list: Item[] = []
  list = addItem(list, "ten")
  const tenID = list.find(i => i.name === "ten")!.id
  list = addItem(list, "nine")
  const nineID = list.find(i => i.name === "nine")!.id
  list = addItem(list, "eight")
  const eightID = list.find(i => i.name === "eight")!.id
  list = addItem(list, "seven")
  list = addItem(list, "six")
  list = addItem(list, "five")
  list = addItem(list, "four")
  const fourID = list.find(i => i.name === "four")!.id
  list = addItem(list, "three")
  list = addItem(list, "two")
  list = addItem(list, "one")
  list = toggleDone(list, tenID)
  list = toggleDone(list, nineID)
  list = toggleDone(list, eightID)

  expect(() => {
    list = moveItemTo(list, fourID, nineID)
  }).toThrow()
})

test("cannot move done items to not done", () => {
  let list: Item[] = []
  list = addItem(list, "ten")
  const tenID = list.find(i => i.name === "ten")!.id
  list = addItem(list, "nine")
  const nineID = list.find(i => i.name === "nine")!.id
  list = addItem(list, "eight")
  const eightID = list.find(i => i.name === "eight")!.id
  list = addItem(list, "seven")
  list = addItem(list, "six")
  list = addItem(list, "five")
  list = addItem(list, "four")
  const fourID = list.find(i => i.name === "four")!.id
  list = addItem(list, "three")
  list = addItem(list, "two")
  list = addItem(list, "one")
  list = toggleDone(list, tenID)
  list = toggleDone(list, nineID)
  list = toggleDone(list, eightID)

  expect(() => {
    list = moveItemTo(list, nineID, fourID)
  }).toThrow()
})

test("clear done - empty list", () => {
  let list: Item[] = []
  list = clearDone(list)
  expect(list).toEqual([])
})

test("clear done - just one, not done", () => {
  let list: Item[] = []
  list = addItem(list, "single")
  list = clearDone(list)
  expect(
    byRank(list)
      .map(i => i.name)
      .join(" "),
  ).toBe("single")
})

test("clear done - just one, done", () => {
  let list: Item[] = []
  list = addItem(list, "single")
  list = toggleDone(list, list[0].id)
  list = clearDone(list)
  expect(list.length).toBe(0)
})

test("clear done - long list, no done", () => {
  let list: Item[] = []
  list = addItem(list, "d")
  list = addItem(list, "c")
  list = addItem(list, "b")
  list = addItem(list, "a")
  list = clearDone(list)
  expect(
    byRank(list)
      .map(i => i.name)
      .join(" "),
  ).toBe("a b c d")
})

test("clear done - long list, one done", () => {
  let list: Item[] = []
  list = addItem(list, "d")
  list = addItem(list, "c")
  list = addItem(list, "b")
  list = addItem(list, "a")
  list = toggleDone(list, list.find(i => i.name === "b")!.id)
  list = clearDone(list)
  expect(
    byRank(list)
      .map(i => i.name)
      .join(" "),
  ).toBe("a c d")
})

test("clear done - long list, some done", () => {
  let list: Item[] = []
  list = addItem(list, "d")
  list = addItem(list, "c")
  list = addItem(list, "b")
  list = addItem(list, "a")
  list = toggleDone(list, list.find(i => i.name === "b")!.id)
  list = toggleDone(list, list.find(i => i.name === "c")!.id)
  list = clearDone(list)
  expect(
    byRank(list)
      .map(i => i.name)
      .join(" "),
  ).toBe("a d")
})

test("clear done - long list, all done", () => {
  let list: Item[] = []
  list = addItem(list, "d")
  list = addItem(list, "c")
  list = addItem(list, "b")
  list = addItem(list, "a")
  list = toggleDone(list, list.find(i => i.name === "b")!.id)
  list = toggleDone(list, list.find(i => i.name === "c")!.id)
  list = toggleDone(list, list.find(i => i.name === "a")!.id)
  list = toggleDone(list, list.find(i => i.name === "d")!.id)
  list = clearDone(list)
  expect(list.length).toBe(0)
})

test("remove - that doesnt exist ", () => {
  let list: Item[] = []
  list = addItem(list, "foo")
  list = addItem(list, "bar")
  list = addItem(list, "baz")
  let after = removeItem(list, "zip" as ItemID)
  expect(after).toEqual(list)
})

test("remove from single list", () => {
  let list: Item[] = []
  list = addItem(list, "foo")
  list = removeItem(list, list[0].id)
  expect(list.length).toBe(0)
})

test("remove from long list", () => {
  let list: Item[] = []
  list = addItem(list, "e")
  list = addItem(list, "d")
  list = addItem(list, "c")
  list = addItem(list, "b")
  list = addItem(list, "a")
  list = removeItem(list, list.find(i => i.name === "b")!.id)
  expect(
    byRank(list)
      .map(i => i.name)
      .join(" "),
  ).toBe("a c d e")
})

test("set name", () => {
  let list: Item[] = []
  list = addItem(list, "bar")
  list = addItem(list, "foo")
  const fooID = list.find(i => i.name === "foo")!.id
  const barID = list.find(i => i.name === "bar")!.id
  list = setItemName(list, fooID, "baz")
  list = setItemName(list, barID, "bat")
  expect(
    byRank(list)
      .map(i => i.name)
      .join(" "),
  ).toBe("baz bat")
})

test("set name - missing id", () => {
  let list: Item[] = []
  list = addItem(list, "bar")
  list = addItem(list, "foo")
  const fooID = list.find(i => i.name === "foo")!.id
  const barID = list.find(i => i.name === "bar")!.id
  list = setItemName(list, (fooID + "zzz") as ItemID, "baz")
  list = setItemName(list, (barID + "zzz") as ItemID, "bat")
  expect(
    byRank(list)
      .map(i => i.name)
      .join(" "),
  ).toBe("foo bar")
})

test("rerank", () => {
  let list: Item[] = []
  list = addItem(list, "h")
  list = addItem(list, "g")
  list = addItem(list, "f")
  list = addItem(list, "e")
  list = addItem(list, "d")
  list = addItem(list, "c")
  list = addItem(list, "b")
  list = addItem(list, "a")
  const aid = list.find(i => i.name === "a")!.id
  const bid = list.find(i => i.name === "b")!.id
  const cid = list.find(i => i.name === "c")!.id
  const did = list.find(i => i.name === "d")!.id
  const eid = list.find(i => i.name === "e")!.id
  const fid = list.find(i => i.name === "f")!.id
  list = moveItemTo(list, bid, eid)
  list = moveItemTo(list, cid, eid)
  list = moveItemTo(list, did, eid)
  list = moveItemTo(list, bid, did)
  list = moveItemTo(list, eid, cid)
  list = moveItemTo(list, cid, did)
  list = toggleDone(list, aid)
  list = toggleDone(list, fid)
  list = toggleDone(list, cid)
  list = rerank(list)
  list = byRank(list)
  const rankedNames = list.map(i => i.name).join(" ")
  expect(rankedNames).toEqual("b d e g h c f a")
  const rankList = list.map(i => i.rank).join(" ")
  expect(rankList).toEqual("70000 50000 40000 20000 10000 60000 30000 80000")
  const doneRankList = list.map(i => i.done).join(" ")
  expect(doneRankList).toEqual("0 0 0 0 0 30000 20000 10000")
})

test("postpone a single item", () => {
  let list: Item[] = []
  list = addItem(list, "foo")
  const fooID = list[0].id
  list = addItem(list, "bar")
  list = postpone(list, fooID)
  expect(
    displayList(list)
      .map(i => i.name)
      .join(" "),
  ).toEqual("bar")
})

test("cannot mark postponed items done", () => {
  let list: Item[] = []
  list = addItem(list, "c")
  list = addItem(list, "b")
  list = addItem(list, "a")
  const aid = list.find(i => i.name === "a")!.id
  const bid = list.find(i => i.name === "b")!.id
  const cid = list.find(i => i.name === "c")!.id
  list = postpone(list, aid)
  list = postpone(list, bid)
  list = postpone(list, cid)
  list = toggleDone(list, aid)
  list = toggleDone(list, bid)
  list = toggleDone(list, cid)
  const itemA = getByID(list, aid)!
  const itemB = getByID(list, bid)!
  const itemC = getByID(list, cid)!
  expect(itemA.done).toBe(0)
  expect(itemB.done).toBe(0)
  expect(itemC.done).toBe(0)
  expect(itemA.postponed).toBe(true)
  expect(itemB.postponed).toBe(true)
  expect(itemC.postponed).toBe(true)
})

test("cannot postpone done items", () => {
  let list: Item[] = []
  list = addItem(list, "c")
  list = addItem(list, "b")
  list = addItem(list, "a")
  const aid = list.find(i => i.name === "a")!.id
  const bid = list.find(i => i.name === "b")!.id
  const cid = list.find(i => i.name === "c")!.id
  list = toggleDone(list, aid)
  list = toggleDone(list, bid)
  list = toggleDone(list, cid)
  list = postpone(list, aid)
  list = postpone(list, bid)
  list = postpone(list, cid)
  const itemA = getByID(list, aid)!
  const itemB = getByID(list, bid)!
  const itemC = getByID(list, cid)!
  expect(itemA.postponed).toBe(false)
  expect(itemB.postponed).toBe(false)
  expect(itemC.postponed).toBe(false)
  expect(itemA.done).toBeGreaterThan(0)
  expect(itemB.done).toBeGreaterThan(0)
  expect(itemC.done).toBeGreaterThan(0)
})

test("postpone and restore", () => {
  let list: Item[] = []
  list = addItem(list, "g")
  list = addItem(list, "f")
  list = addItem(list, "e")
  list = addItem(list, "d")
  list = addItem(list, "c")
  list = addItem(list, "b")
  list = addItem(list, "a")
  const aid = list.find(i => i.name === "a")!.id
  const bid = list.find(i => i.name === "b")!.id
  const cid = list.find(i => i.name === "c")!.id
  const did = list.find(i => i.name === "d")!.id
  const eid = list.find(i => i.name === "e")!.id
  const fid = list.find(i => i.name === "f")!.id
  list = postpone(list, bid)
  list = postpone(list, did)
  list = postpone(list, fid)
  expect(
    displayList(list).map(({ name, rank, done }) => ({
      name,
      rank,
      done,
    })),
  ).toEqual([
    { name: "a", rank: 70000, done: 0 },
    { name: "c", rank: 50000, done: 0 },
    { name: "e", rank: 30000, done: 0 },
    { name: "g", rank: 10000, done: 0 },
  ])
  list = toggleDone(list, cid)
  list = toggleDone(list, eid)
  list = clearDone(list)
  list = toggleDone(list, aid)
  expect(
    displayList(list).map(({ name, rank, done }) => ({
      name,
      rank,
      done,
    })),
  ).toEqual([
    { name: "g", rank: 10000, done: 0 },
    { name: "a", rank: 70000, done: 10000 },
  ])
  list = addPostponed(list)
  expect(
    displayList(list).map(({ name, rank, done }) => ({
      name,
      rank,
      done,
    })),
  ).toEqual([
    { name: "b", rank: 100000, done: 0 },
    { name: "d", rank: 90000, done: 0 },
    { name: "f", rank: 80000, done: 0 },
    { name: "g", rank: 10000, done: 0 },
    { name: "a", rank: 70000, done: 10000 },
  ])
})

test("count postponed", () => {
  let list: Item[] = []
  list = addItem(list, "g")
  list = addItem(list, "f")
  list = addItem(list, "e")
  list = addItem(list, "d")
  list = addItem(list, "c")
  list = addItem(list, "b")
  list = addItem(list, "a")
  const bid = list.find(i => i.name === "b")!.id
  const did = list.find(i => i.name === "d")!.id
  const fid = list.find(i => i.name === "f")!.id
  expect(countPostponed(list)).toBe(0)
  list = postpone(list, bid)
  expect(countPostponed(list)).toBe(1)
  list = postpone(list, did)
  expect(countPostponed(list)).toBe(2)
  list = postpone(list, fid)
  expect(countPostponed(list)).toBe(3)
  list = addPostponed(list)
  expect(countPostponed(list)).toBe(0)
})

test("repeating items can be restored", () => {
  let list: Item[] = []
  list = addItem(list, "g")
  list = addItem(list, "f")
  list = addItem(list, "e")
  list = addItem(list, "d")
  list = addItem(list, "c")
  list = addItem(list, "b")
  list = addItem(list, "a")
  const bid = list.find(i => i.name === "b")!.id
  const cid = list.find(i => i.name === "c")!.id
  const did = list.find(i => i.name === "d")!.id
  const eid = list.find(i => i.name === "e")!.id
  list = toggleRepeating(list, bid)
  list = toggleRepeating(list, cid)
  list = toggleRepeating(list, did)
  expect(
    displayList(list).map(({ name, rank, repeating }) => ({
      name,
      rank,
      repeating,
    })),
  ).toEqual([
    { name: "a", rank: 70000, repeating: Repeating.NO },
    { name: "b", rank: 60000, repeating: Repeating.YES },
    { name: "c", rank: 50000, repeating: Repeating.YES },
    { name: "d", rank: 40000, repeating: Repeating.YES },
    { name: "e", rank: 30000, repeating: Repeating.NO },
    { name: "f", rank: 20000, repeating: Repeating.NO },
    { name: "g", rank: 10000, repeating: Repeating.NO },
  ])

  list = toggleDone(list, bid)
  list = toggleDone(list, did)
  list = toggleDone(list, eid)
  expect(
    displayList(list).map(({ name, rank, repeating }) => ({
      name,
      rank,
      repeating,
    })),
  ).toEqual([
    { name: "a", rank: 70000, repeating: Repeating.NO },
    { name: "c", rank: 50000, repeating: Repeating.YES },
    { name: "f", rank: 20000, repeating: Repeating.NO },
    { name: "g", rank: 10000, repeating: Repeating.NO },
    { name: "e", rank: 30000, repeating: Repeating.NO },
    { name: "d", rank: 40000, repeating: Repeating.YES },
    { name: "b", rank: 60000, repeating: Repeating.YES },
  ])
  list = clearDone(list)
  expect(
    displayList(list).map(({ name, rank, repeating }) => ({
      name,
      rank,
      repeating,
    })),
  ).toEqual([
    { name: "a", rank: 70000, repeating: Repeating.NO },
    { name: "c", rank: 50000, repeating: Repeating.YES },
    { name: "f", rank: 20000, repeating: Repeating.NO },
    { name: "g", rank: 10000, repeating: Repeating.NO },
  ])

  list = restoreRepeating(list)
  expect(
    displayList(list).map(({ name, rank, repeating }) => ({
      name,
      rank,
      repeating,
    })),
  ).toEqual([
    { name: "b", rank: 90000, repeating: Repeating.YES },
    { name: "d", rank: 80000, repeating: Repeating.YES },
    { name: "a", rank: 70000, repeating: Repeating.NO },
    { name: "c", rank: 50000, repeating: Repeating.YES },
    { name: "f", rank: 20000, repeating: Repeating.NO },
    { name: "g", rank: 10000, repeating: Repeating.NO },
  ])
})

test("count cleared repeating", () => {
  let list: Item[] = []
  list = addItem(list, "d")
  list = addItem(list, "c")
  list = addItem(list, "b")
  list = addItem(list, "a")

  expect(countClearedRepeating(list)).toBe(0)

  const aid = list.find(i => i.name === "a")!.id
  const bid = list.find(i => i.name === "b")!.id
  const cid = list.find(i => i.name === "c")!.id
  const did = list.find(i => i.name === "d")!.id

  list = toggleRepeating(list, aid)
  list = toggleRepeating(list, bid)
  list = toggleDone(list, aid)

  list = clearDone(list)

  expect(countClearedRepeating(list)).toBe(1)

  list = toggleRepeating(list, bid)
  list = toggleDone(list, bid)
  list = toggleRepeating(list, cid)
  list = toggleDone(list, cid)
  list = clearDone(list)

  expect(countClearedRepeating(list)).toBe(2)

  list = toggleRepeating(list, did)
  list = toggleDone(list, did)
  list = clearDone(list)

  expect(countClearedRepeating(list)).toBe(3)
})
