export default function (include) {
  return async function* (iterator) {
    for await (const item of iterator) {
      if (include(item)) {
        yield item
      }
    }
  }
}
