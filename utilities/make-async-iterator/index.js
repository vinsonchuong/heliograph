/* @flow */

export default function<Item>(
  next: () => Promise<
    { done: true, value?: empty } | { done: false, value: Item }
  >
): AsyncIterator<Item> {
  // $FlowFixMe
  return {
    // $FlowFixMe
    [Symbol.asyncIterator]() {
      return this
    },
    next
  }
}
