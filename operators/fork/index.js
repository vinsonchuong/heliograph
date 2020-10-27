import {fromQueue} from '../../index.js'

export default function (iterator, times) {
  const copiedIterators = new Array(times).fill(null).map(() => fromQueue())

  async function copyItems() {
    try {
      for await (const item of iterator) {
        for (const copiedIterator of copiedIterators) {
          copiedIterator.push(item)
        }
      }

      for (const copiedIterator of copiedIterators) {
        copiedIterator.end()
      }
    } catch (error) {
      for (const copiedIterator of copiedIterators) {
        copiedIterator.pushError(error)
      }
    }
  }

  copyItems()

  return copiedIterators
}
