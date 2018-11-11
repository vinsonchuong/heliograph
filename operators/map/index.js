/* @flow */

export default function<Item, TransformedItem>(
  transform: Item => TransformedItem
): (AsyncIterator<Item>) => AsyncIterator<TransformedItem> {
  return async function*(iterator) {
    for await (const item of iterator) {
      yield transform(item)
    }
  }
}
