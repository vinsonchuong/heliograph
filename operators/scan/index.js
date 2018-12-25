/* @flow */
export default function<Item, ScanItem>(
  windowSize: number,
  transform: (Array<Item>) => ScanItem
): (AsyncIterator<Item>) => AsyncIterator<?ScanItem> {
  return async function*(iterator) {
    const window = []

    for await (const item of iterator) {
      window.push(item)

      if (window.length > windowSize) {
        window.shift()
      }

      yield window.length === windowSize ? transform(window) : null
    }
  }
}
