export default function (transform) {
  return async function* (iterator) {
    for await (const item of iterator) {
      yield transform(item)
    }
  }
}
