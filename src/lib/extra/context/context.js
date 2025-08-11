class ContextResolver {
  constructor(resolve) {
    this._resolve = resolve
    this.providers = []
  }
  resolve(data) {
    return this.providers.reduce(
      (content, provider) => provider(content),
      this._resolve(data),
    )
  }
}

export function createContext() {
  class ParticularContextResolver extends ContextResolver {}

  function use(resolve) {
    return new ParticularContextResolver(resolve)
  }

  function provide(data, content) {
    if (Array.isArray(content)) return content.map(node => provide(data, node))
    if (content instanceof ContextResolver) {
      if (content instanceof ParticularContextResolver)
        return provide(data, content.resolve(data))
      content.providers.push(content => provide(data, content))
      return content
    }
    if (!content || !content.children) return content
    return { ...content, children: provide(data, content.children) }
  }

  return { provide, use }
}
