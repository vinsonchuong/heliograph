/* @flow */
import { fromQueue } from 'heliograph'

export default function<Item>(
  ...iterators: Array<$AsyncIterator<Item, void, void>>
): $AsyncIterator<Item, void, void> {
  const queue = fromQueue()
  const finishedIterators = new Set()

  iterators.forEach(async iterator => {
    for await (const value of iterator) {
      queue.push(value)
    }
    finishedIterators.add(iterator)

    if (iterators.every(iterator => finishedIterators.has(iterator))) {
      queue.end()
    }
  })

  return queue
}
