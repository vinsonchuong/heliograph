/* @flow */
export default async function*/*:: <Item> */(
  ...iterators /*: Array<AsyncIterator<Item>> */
): AsyncIterator<Item> {
  for (const iterator of iterators) {
    yield* iterator
  }
}
