/*

Overrides the addEventListener and removeEventListener
on HTMLElement.prototype in order to enable passive
event listeners in hyperapp, by adding the suffix
"_passive" to an "onsomevent" property. I.e:

h("div", {ontouchstart_passive: SomeAction}, ...)

SomeAction will be bound to the touchstart event,
but using {passive: true} option passed to 
addEventListener.

*/

const originalAddEventListener = HTMLElement.prototype.addEventListener
const originalRemoveEventListener = HTMLElement.prototype.removeEventListener
HTMLElement.prototype.addEventListener = function (name, handler, options) {
  if (name.match(/_passive$/)) {
    const trueName = name.replace(/_passive$/, "")
    this.events[trueName] = this.events[name]
    return originalAddEventListener.call(this, trueName, handler, {
      passive: true,
    })
  }
  return originalAddEventListener.call(this, name, handler, options)
}
HTMLElement.prototype.removeEventListener = function (name, handler, options) {
  if (name.match(/_passive$/)) {
    const trueName = name.replace(/_passive$/, "")
    delete this.events[trueName]
    name = trueName
  }
  return originalRemoveEventListener.call(this, name, handler, options)
}
