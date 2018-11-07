/* @flow */

export default async function* /*:: <Item, TransformedItem> */ ( /* eslint-disable-line */
  transform: Item => TransformedItem,
  iterator: AsyncIterator<Item>
): AsyncIterator<TransformedItem> {
  for await (const item of iterator) {
    yield transform(item)
  }
}
