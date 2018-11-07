/* @flow */
import { makeAsyncIterator } from 'heliograph/utilities'

export default function<Item1, Item2>(
  iterator1: AsyncIterator<Item1>,
  iterator2: AsyncIterator<Item2>
): AsyncIterator<[Item1, Item2]> {
  return makeAsyncIterator(() => {
    const promise1 = iterator1.next()
    const promise2 = iterator2.next()

    return Promise.race([
      new Promise(async resolve => {
        const { done } = await promise1
        if (done) resolve({ done: true })
      }),

      new Promise(async resolve => {
        const { done } = await promise2
        if (done) resolve({ done: true })
      }),

      (async function() {
        const item1 = await promise1
        const item2 = await promise2

        if (item1.value && item2.value) {
          return { done: false, value: [item1.value, item2.value] }
        } else {
          return { done: true }
        }
      })()
    ])
  })
}
