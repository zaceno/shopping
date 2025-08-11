import { test, expect } from "vitest"
import { createContext } from "./context"
import { type MaybeVNode } from "hyperapp"

test("provide a string to single direct user", () => {
  let context = createContext<string>()
  expect(
    <div>
      {context.provide(
        "foo",
        context.use(str => <p>{str}</p>),
      )}
    </div>,
  ).toEqual(
    <div>
      <p>foo</p>
    </div>,
  )
})

test("provide a string to children", () => {
  let context = createContext<string>()
  expect(
    <div>
      {context.provide(
        "foo",
        <>
          <p>bar</p>
          {context.use(str => (
            <>
              <p>tip</p>
              <p>{str}</p>
              <p>top</p>
            </>
          ))}
          <p>baz</p>
        </>,
      )}
    </div>,
  ).toEqual(
    <div>
      <p>bar</p>
      <p>tip</p>
      <p>foo</p>
      <p>top</p>
      <p>baz</p>
    </div>,
  )
})

test("nested data to children", () => {
  let context = createContext<{ foo: string; bar: boolean }>()
  const ComponentA = () => (
    <div class="a">
      {context.use(data => (
        <h1>{data.foo}</h1>
      ))}
    </div>
  )
  const ComponentB = <S,>(_: {}, children: MaybeVNode<S> | MaybeVNode<S>[]) =>
    context.use(data => (
      <div class="b">
        {data.bar ? <p>bar</p> : <p>foo</p>}
        {children}
      </div>
    ))
  const struct = (
    <div class="outer">
      <context.provide foo="thestring" bar={true}>
        <p>nonce</p>
        <ComponentB>
          <p>b child</p>
          <ComponentA />
        </ComponentB>
        <p>nonce</p>
      </context.provide>
    </div>
  )
  expect(struct).toEqual(
    <div class="outer">
      <p>nonce</p>
      <div class="b">
        <p>bar</p>
        <p>b child</p>
        <div class="a">
          <h1>thestring</h1>
        </div>
      </div>
      <p>nonce</p>
    </div>,
  )
})

test("multiple contexts nested", () => {
  let AContext = createContext<{ a: string }>()
  let BContext = createContext<{ b: string }>()
  const struct = (
    <div class="outer">
      <AContext.provide a="aaa">
        <div class="inside-a-provider">
          <BContext.provide b="bbb">
            <div class="inside-b-provider">
              {BContext.use(({ b }) => (
                <div class="inside-b-consumer">
                  <p class="b-output">{b}</p>
                  {AContext.use(({ a }) => (
                    <div class="inside-a-consumer">
                      <p class="a-output">{a}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </BContext.provide>
        </div>
      </AContext.provide>
    </div>
  )
  expect(struct).toEqual(
    <div class="outer">
      <div class="inside-a-provider">
        <div class="inside-b-provider">
          <div class="inside-b-consumer">
            <p class="b-output">bbb</p>
            <div class="inside-a-consumer">
              <p class="a-output">aaa</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
  )
})

test("multiple contexts sequential", () => {
  let AContext = createContext<{ a: string }>()
  let BContext = createContext<{ b: string }>()
  const struct = (
    <div class="outer">
      <AContext.provide a="aaa">
        <div class="inside-a-provider">
          <BContext.provide b="bbb">
            <div class="inside-b-provider">
              {AContext.use(({ a }) => (
                <div class="inside-a-consumer">
                  <p class="a-output">{a}</p>
                  {BContext.use(({ b }) => (
                    <div class="inside-b-consumer">
                      <p class="b-output">{b}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </BContext.provide>
        </div>
      </AContext.provide>
    </div>
  )
  expect(struct).toEqual(
    <div class="outer">
      <div class="inside-a-provider">
        <div class="inside-b-provider">
          <div class="inside-a-consumer">
            <p class="a-output">aaa</p>
            <div class="inside-b-consumer">
              <p class="b-output">bbb</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
  )
})

test("multiple contexts A> B> C> <C <B <A", () => {
  let AContext = createContext<{ a: string }>()
  let BContext = createContext<{ b: string }>()
  let CContext = createContext<{ c: string }>()
  const struct = (
    <div class="outer">
      <AContext.provide a="aaa">
        <div class="inside-a-provider">
          <BContext.provide b="bbb">
            <div class="inside-b-provider">
              <CContext.provide c="ccc">
                <div class="inside-c-provider">
                  {CContext.use(({ c }) => (
                    <div class="inside-c-consumer">
                      <p class="c-output">{c}</p>
                      {BContext.use(({ b }) => (
                        <div class="inside-b-consumer">
                          <p class="b-output">{b}</p>
                          {AContext.use(({ a }) => (
                            <div class="inside-a-consumer">
                              <p class="a-output">{a}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CContext.provide>
            </div>
          </BContext.provide>
        </div>
      </AContext.provide>
    </div>
  )
  expect(struct).toEqual(
    <div class="outer">
      <div class="inside-a-provider">
        <div class="inside-b-provider">
          <div class="inside-c-provider">
            <div class="inside-c-consumer">
              <p class="c-output">ccc</p>
              <div class="inside-b-consumer">
                <p class="b-output">bbb</p>
                <div class="inside-a-consumer">
                  <p class="a-output">aaa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
  )
})

test("multiple contexts A> B> C> <A <B <C ", () => {
  let AContext = createContext<{ a: string }>()
  let BContext = createContext<{ b: string }>()
  let CContext = createContext<{ c: string }>()
  const struct = (
    <div class="outer">
      <AContext.provide a="aaa">
        <div class="inside-a-provider">
          <BContext.provide b="bbb">
            <div class="inside-b-provider">
              <CContext.provide c="ccc">
                <div class="inside-c-provider">
                  {AContext.use(({ a }) => (
                    <div class="inside-a-consumer">
                      <p class="a-output">{a}</p>
                      {BContext.use(({ b }) => (
                        <div class="inside-b-consumer">
                          <p class="b-output">{b}</p>
                          {CContext.use(({ c }) => (
                            <div class="inside-c-consumer">
                              <p class="c-output">{c}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CContext.provide>
            </div>
          </BContext.provide>
        </div>
      </AContext.provide>
    </div>
  )
  expect(struct).toEqual(
    <div class="outer">
      <div class="inside-a-provider">
        <div class="inside-b-provider">
          <div class="inside-c-provider">
            <div class="inside-a-consumer">
              <p class="a-output">aaa</p>
              <div class="inside-b-consumer">
                <p class="b-output">bbb</p>
                <div class="inside-c-consumer">
                  <p class="c-output">ccc</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
  )
})

test("multiple contexts A> B> C> <A <C <B ", () => {
  let AContext = createContext<{ a: string }>()
  let BContext = createContext<{ b: string }>()
  let CContext = createContext<{ c: string }>()
  const struct = (
    <div class="outer">
      <AContext.provide a="aaa">
        <div class="inside-a-provider">
          <BContext.provide b="bbb">
            <div class="inside-b-provider">
              <CContext.provide c="ccc">
                <div class="inside-c-provider">
                  {AContext.use(({ a }) => (
                    <div class="inside-a-consumer">
                      <p class="a-output">{a}</p>

                      {CContext.use(({ c }) => (
                        <div class="inside-c-consumer">
                          <p class="c-output">{c}</p>

                          {BContext.use(({ b }) => (
                            <div class="inside-b-consumer">
                              <p class="b-output">{b}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CContext.provide>
            </div>
          </BContext.provide>
        </div>
      </AContext.provide>
    </div>
  )
  expect(struct).toEqual(
    <div class="outer">
      <div class="inside-a-provider">
        <div class="inside-b-provider">
          <div class="inside-c-provider">
            <div class="inside-a-consumer">
              <p class="a-output">aaa</p>
              <div class="inside-c-consumer">
                <p class="c-output">ccc</p>
                <div class="inside-b-consumer">
                  <p class="b-output">bbb</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
  )
})

test("multiple contexts A> B> C> <B <A <C", () => {
  let AContext = createContext<{ a: string }>()
  let BContext = createContext<{ b: string }>()
  let CContext = createContext<{ c: string }>()
  const struct = (
    <div class="outer">
      <AContext.provide a="aaa">
        <div class="inside-a-provider">
          <BContext.provide b="bbb">
            <div class="inside-b-provider">
              <CContext.provide c="ccc">
                <div class="inside-c-provider">
                  {BContext.use(({ b }) => (
                    <div class="inside-b-consumer">
                      <p class="b-output">{b}</p>
                      {AContext.use(({ a }) => (
                        <div class="inside-a-consumer">
                          <p class="a-output">{a}</p>
                          {CContext.use(({ c }) => (
                            <div class="inside-c-consumer">
                              <p class="c-output">{c}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CContext.provide>
            </div>
          </BContext.provide>
        </div>
      </AContext.provide>
    </div>
  )
  expect(struct).toEqual(
    <div class="outer">
      <div class="inside-a-provider">
        <div class="inside-b-provider">
          <div class="inside-c-provider">
            <div class="inside-b-consumer">
              <p class="b-output">bbb</p>
              <div class="inside-a-consumer">
                <p class="a-output">aaa</p>
                <div class="inside-c-consumer">
                  <p class="c-output">ccc</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
  )
})
