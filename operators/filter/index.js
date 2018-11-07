/* @flow */

export default async function* /*:: <Item> */ ( /* eslint-disable-line */
  include: Item => boolean,
  iterator: AsyncIterator<Item>
): AsyncIterator<Item> {
  for await (const item of iterator) {
    if (include(item)) {
      yield item
    }
  }
}
