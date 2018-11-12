/* @flow */
export default function<Item>(
  processItem: Item => void
): (AsyncIterator<Item>) => AsyncIterator<Item> {
  return async function*(iterator) {
    for await (const item of iterator) {
      processItem(item)
      yield item
    }
  }
}
