/* @flow */
export default async function<Item>(
  iterator: AsyncIterator<Item>
): Promise<Array<Item>> {
  const result = []
  for await (const item of iterator) {
    result.push(item)
  }
  return result
}
