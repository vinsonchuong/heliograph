/* @flow */
import { makeAsyncIterator } from 'heliograph/utilities'

export default function<Item1, Item2>(
  iterator1: $AsyncIterator<Item1, void, void>,
  iterator2: $AsyncIterator<Item2, void, void>
): $AsyncIterator<[Item1, Item2], void, void> {
  return makeAsyncIterator(async () => {
    const item1 = await iterator1.next()
    const item2 = await iterator2.next()

    if (item1.value && item2.value) {
      return { done: false, value: [item1.value, item2.value] }
    } else {
      return { done: true }
    }
  })
}
