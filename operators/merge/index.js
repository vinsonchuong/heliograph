import {fromQueue} from '../../index.js'

export default function (...iterators) {
  const queue = fromQueue()
  const finishedIterators = new Set()

  iterators.forEach(async (iterator) => {
    try {
      for await (const value of iterator) {
        queue.push(value)
      }

      finishedIterators.add(iterator)

      if (iterators.every((iterator) => finishedIterators.has(iterator))) {
        queue.end()
      }
    } catch (error) {
      queue.pushError(error)
    }
  })

  return queue
}
