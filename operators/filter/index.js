/* @flow */

export default function<Item>(
  include: Item => boolean
): (AsyncIterator<Item>) => AsyncIterator<Item> {
  return async function*(iterator) {
    for await (const item of iterator) {
      if (include(item)) {
        yield item
      }
    }
  }
}
