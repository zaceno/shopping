import { type Dispatch, type Action } from "hyperapp"

type DNDOptions<S> = {
  selector: string
  onOver: Action<S, { dragged: HTMLElement; over: HTMLElement }>
}

type OnOverHandler = (d1: HTMLElement, d2: HTMLElement) => void

class DragNDrop {
  handleOver: OnOverHandler
  teardown: () => void = () => {}
  draggableElements: HTMLElement[] = []
  dragging: HTMLElement | null = null
  currentX: number = 0
  currentY: number = 0
  currentOver: HTMLElement | undefined

  startTop: number = 0
  startLeft: number = 0
  grabOffsetX: number = 0
  grabOffsetY: number = 0
  checkFrame: number = 0
  layoutFrame: number = 0

  constructor(draggableSelector: string, onOver: OnOverHandler) {
    this.handleOver = onOver
    this.draggableElements = [
      ...document.querySelectorAll(draggableSelector),
    ] as HTMLElement[]

    const mouseDownHandler = (ev: MouseEvent) => {
      ev.preventDefault()
      this.startDragHandler(
        ev.currentTarget as HTMLElement,
        ev.clientX,
        ev.clientY,
      )
    }

    const touchStartHandler = (ev: TouchEvent) => {
      this.startDragHandler(
        ev.currentTarget as HTMLElement,
        ev.touches[0].clientX,
        ev.touches[0].clientY,
      )
    }

    const mouseMoveHandler = (ev: MouseEvent) => {
      ev.preventDefault()
      this.dragMoveHandler(ev.clientX, ev.clientY)
    }

    const touchMoveHandler = (ev: TouchEvent) => {
      this.dragMoveHandler(ev.touches[0].clientX, ev.touches[0].clientY)
    }

    const touchEndHandler = () => {
      this.dragStopHandler()
    }
    const mouseUpHandler = () => {
      this.dragStopHandler()
    }

    this.draggableElements.forEach(el => {
      el.style.touchAction = "none"
      el.addEventListener("mousedown", mouseDownHandler)
      el.addEventListener("touchstart", touchStartHandler, { passive: true })
    })
    window.addEventListener("mouseup", mouseUpHandler)
    window.addEventListener("touchend", touchEndHandler, { passive: true })
    window.addEventListener("mousemove", mouseMoveHandler)
    window.addEventListener("touchmove", touchMoveHandler, { passive: true })

    this.teardown = () => {
      this.draggableElements.forEach(el => {
        el.style.touchAction = "auto"
        el.removeEventListener("mousedown", mouseDownHandler)
        el.removeEventListener("touchstart", touchStartHandler)
      })
      window.removeEventListener("mouseup", mouseUpHandler)
      window.removeEventListener("touchend", touchEndHandler)
      window.removeEventListener("mousemove", mouseMoveHandler)
      window.removeEventListener("touchmove", touchMoveHandler)
    }
  }

  startDragHandler(elem: HTMLElement, posX: number, posY: number) {
    this.dragging = elem
    elem.setAttribute("data-dnd-dragging", "dragging")
    const { top, left } = elem.getBoundingClientRect()
    this.startTop = top
    this.startLeft = left
    this.grabOffsetX = posX - left
    this.grabOffsetY = posY - top
    this.currentX = posX
    this.currentY = posY
  }

  dragMoveHandler(posX: number, posY: number) {
    if (!this.dragging) return
    this.currentX = posX
    this.currentY = posY
    const tx = posX - this.startLeft - this.grabOffsetX
    const ty = posY - this.startTop - this.grabOffsetY
    this.dragging.style.transform = `translate(${tx}px, ${ty}px)`
    if (this.checkFrame) cancelAnimationFrame(this.checkFrame)
    this.checkFrame = requestAnimationFrame(() => {
      this.checkIfOver()
    })
  }

  checkIfOver() {
    if (!this.dragging) return
    let nowOver = this.draggableElements.find(el => {
      if (el === this.dragging) return false
      let rect = el.getBoundingClientRect()
      return (
        this.currentX > rect.left &&
        this.currentX <= rect.right &&
        this.currentY > rect.top &&
        this.currentY <= rect.bottom
      )
    })
    if (nowOver !== this.currentOver) {
      this.currentOver = nowOver
      nowOver && this.handleOver(this.dragging, nowOver)
    }
  }

  dragStopHandler() {
    if (!this.dragging) return
    this.dragging.removeAttribute("data-dnd-dragging")
    this.dragging.style.transform = ""
    this.dragging = null
  }

  updateLayout() {
    if (this.layoutFrame) cancelAnimationFrame(this.layoutFrame)
    this.layoutFrame = requestAnimationFrame(() => {
      if (!this.dragging) return
      this.dragging.style.transform = ""
      const rect = this.dragging.getBoundingClientRect()
      this.startTop = rect.top
      this.startLeft = rect.left
      const tx = this.currentX - this.startLeft - this.grabOffsetX
      const ty = this.currentY - this.startTop - this.grabOffsetY
      this.dragging.style.transform = `translate(${tx}px, ${ty}px)`
    })
  }
}

let singleton: DragNDrop | null = null

export const dndNotifyLayout = () => {
  if (singleton) {
    singleton.updateLayout()
  }
}

export const dragndrop = <S>(dispatch: Dispatch<S>, options: DNDOptions<S>) => {
  const onOver: OnOverHandler = (dragged, over) => {
    dispatch(options.onOver, { dragged, over })
  }
  //subscriptions are started before new view rendering
  //is scheduled. So we need to wait two frames. One for
  //the new render to be scheduled, and the second until
  //the new render is completed. That way we can be sure
  //the draggable-selectors will be present in the DOM
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      singleton = new DragNDrop(options.selector, onOver)
    })
  })
  return () => {
    if (singleton) {
      singleton.teardown()
      singleton = null
    }
  }
}
