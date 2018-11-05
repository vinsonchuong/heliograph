/* @flow */

export default function<Item>(
  next: () => Promise<{ done: true } | { done: false, value: Item }>
): $AsyncIterator<Item, void, void> {
  /* $FlowFixMe */
  return {
    /* $FlowFixMe */
    [Symbol.asyncIterator]() {
      return this
    },
    next
  }
}
