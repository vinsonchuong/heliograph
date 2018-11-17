/* @flow */
import { fromQueue } from 'heliograph'

export default function<Item>(
  ...iterators: Array<AsyncIterator<Item>>
): AsyncIterator<Item> {
  const queue = fromQueue()
  const finishedIterators = new Set()

  iterators.forEach(async iterator => {
    try {
      for await (const value of iterator) {
        queue.push(value)
      }

      finishedIterators.add(iterator)

      if (iterators.every(iterator => finishedIterators.has(iterator))) {
        queue.end()
      }
    } catch (error) {
      queue.pushError(error)
    }
  })

  return queue
}
