/* @flow */
import { fromQueue } from 'heliograph'

export default function<Item>(
  iterator: AsyncIterator<Item>,
  times: number
): $ReadOnlyArray<AsyncIterator<Item>> {
  const copiedIterators = Array(times)
    .fill(null)
    .map(fromQueue)

  async function copyItems() {
    for await (const item of iterator) {
      for (const copiedIterator of copiedIterators) {
        copiedIterator.push(item)
      }
    }

    for (const copiedIterator of copiedIterators) {
      copiedIterator.end()
    }
  }
  copyItems()

  return copiedIterators
}
