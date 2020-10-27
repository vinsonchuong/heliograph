export default function (processItem) {
  return async function* (iterator) {
    for await (const item of iterator) {
      processItem(item)
      yield item
    }
  }
}
