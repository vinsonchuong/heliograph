/* @flow */
export default function<Item>(
  predicate: (Item, Item) => boolean
): (AsyncIterator<Item>) => AsyncIterator<Array<Item>> {
  return async function*(iterator) {
    let currentGroup = []

    for await (const item of iterator) {
      if (currentGroup.length > 0) {
        if (predicate(currentGroup[currentGroup.length - 1], item)) {
          yield currentGroup
          currentGroup = []
        }
      }

      currentGroup.push(item)
    }

    yield currentGroup
  }
}
