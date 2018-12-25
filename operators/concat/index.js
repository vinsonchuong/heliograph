/* @flow */
export default async function* /*:: <Item> */( // eslint-disable-line
  ...iterators: Array<AsyncIterator<Item>>
): AsyncIterator<Item> {
  for (const iterator of iterators) {
    yield* iterator
  }
}
