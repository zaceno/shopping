import { type Dispatch, type Action } from "hyperapp"

type DragStartEffectOptions<S> = {
  event: MouseEvent | TouchEvent
  onOver: Action<S, { draggedID: string; overID: string }>
}

const dragStartEffect = <S>(
  dispatch: Dispatch<S>,
  options: DragStartEffectOptions<S>,
) => {
  // start keeping track of the elements we can drop on
  const elements = [
    ...document.querySelectorAll("[data-dndid]"),
  ] as HTMLElement[]

  // mark the handle as the handle
  const handle = options.event.currentTarget as HTMLElement
  handle.style.touchAction = "none"
  handle.dataset.dndcurrentdraghandle = "true"

  // find the element to drag, from the handle
  const dragged = document.querySelector(
    "[data-dndid]:has([data-dndcurrentdraghandle])",
  ) as HTMLElement

  dragged.dataset.dndcurrentdragged = "true"

  // set the initial tracking data based on the dragged element's
  // position and the pointer position when event occurred.
  const { clientX, clientY } =
    "touches" in options.event ? options.event.touches[0] : options.event
  const { top, left } = dragged.getBoundingClientRect()
  let startTop = top
  let startLeft = left
  let grabOffsetX = clientX - left
  let grabOffsetY = clientY - top
  let currentX = clientX
  let currentY = clientY

  // call this when drag moves
  let checkframe: number = 0 //use to debounce checking if we are over
  let currentover: HTMLElement | undefined = undefined //use to only handle dragover once per elem
  const dragMoveHandler = (x: number, y: number) => {
    //update tracked position and transform dragged position
    currentX = x
    currentY = y
    const tx = x - startLeft - grabOffsetX
    const ty = y - startTop - grabOffsetY
    dragged.style.transform = `translate(${tx}px, ${ty}px)`

    // see if we are over another element, and if so
    // handle it and
    if (checkframe) cancelAnimationFrame(checkframe)
    checkframe = requestAnimationFrame(() => {
      let nowOver = elements.find(el => {
        if (el === dragged) return false
        let rect = el.getBoundingClientRect()
        return (
          currentX > rect.left &&
          currentX <= rect.right &&
          currentY > rect.top &&
          currentY <= rect.bottom
        )
      })
      if (nowOver !== currentover) {
        currentover = nowOver
        if (nowOver) {
          //handle the fact we are over a new element
          //dispatch the requested action for going over an element
          dispatch(options.onOver, {
            draggedID: dragged.dataset.dndid,
            overID: nowOver.dataset.dndid,
          })
          //wait for eventual rerender, then update the tracking data for new layout
          requestAnimationFrame(() => {
            dragged.style.transform = ""
            const rect = dragged.getBoundingClientRect()
            startTop = rect.top
            startLeft = rect.left
            const tx = currentX - startLeft - grabOffsetX
            const ty = currentY - startTop - grabOffsetY
            dragged.style.transform = `translate(${tx}px, ${ty}px)`
          })
        }
      }
    })
  }

  const dragStopHandler = () => {
    delete handle.dataset.dndcurrentdraghandle
    dragged.style.transform = ""
    delete dragged.dataset.dndcurrentdragged
    window.removeEventListener("mouseup", mouseUpHandler)
    window.removeEventListener("touchend", touchEndHandler)
    window.removeEventListener("mousemove", mouseMoveHandler)
    window.removeEventListener("touchmove", touchMoveHandler)
  }

  const mouseMoveHandler = (ev: MouseEvent) => {
    ev.preventDefault()
    dragMoveHandler(ev.clientX, ev.clientY)
  }

  const touchMoveHandler = (ev: TouchEvent) => {
    dragMoveHandler(ev.touches[0].clientX, ev.touches[0].clientY)
  }

  const touchEndHandler = () => {
    dragStopHandler()
  }
  const mouseUpHandler = () => {
    dragStopHandler()
  }

  window.addEventListener("mouseup", mouseUpHandler)
  window.addEventListener("touchend", touchEndHandler, { passive: true })
  window.addEventListener("mousemove", mouseMoveHandler)
  window.addEventListener("touchmove", touchMoveHandler, { passive: true })
}

export const withOnOverDragStart =
  <S>(onOver: DragStartEffectOptions<S>["onOver"]): Action<S, Event> =>
  (state, event) =>
    [
      state,
      [
        dragStartEffect<S>,
        {
          event,
          onOver,
        },
      ],
    ]
