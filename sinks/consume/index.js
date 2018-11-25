/* @flow */
export default function<Item>(
  processItem: Item => void
): (AsyncIterator<Item>) => Promise<void> {
  return async iterator => {
    for await (const item of iterator) {
      await processItem(item)
    }
  }
}
