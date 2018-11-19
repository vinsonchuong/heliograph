/* @flow */

type AsyncIteratorDefinition<Value> = {
  next: () => Promise<
    $ReadOnly<{ done: false, value: Value } | { done: true, value?: empty }>
  >
}

export default function<Value, Properties: AsyncIteratorDefinition<Value>>(
  properties: Properties
): AsyncIterator<Value> & Properties {
  /* $FlowFixMe */
  return {
    /* $FlowFixMe */
    [Symbol.asyncIterator]() {
      return this
    },
    ...properties
  }
}
