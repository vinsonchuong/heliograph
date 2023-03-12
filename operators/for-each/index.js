export default function (fn) {
  return async (iterator) => {
    for await (const value of iterator) {
      fn(value)
    }
  }
}
