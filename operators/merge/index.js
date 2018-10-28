/* @flow */
import { fromQueue } from 'heliograph'

export default function<Item, Iterator: $AsyncIterator<Item, void, void>>(
  ...iterators: Array<Iterator>
): $AsyncIterator<{ source: Iterator, value: Item }, void, void> {
  const queue = fromQueue()
  const finishedIterators = new Set()

  iterators.forEach(async iterator => {
    for await (const value of iterator) {
      queue.push({ source: iterator, value })
    }
    finishedIterators.add(iterator)

    if (iterators.every(iterator => finishedIterators.has(iterator))) {
      queue.end()
    }
  })

  return queue
}
