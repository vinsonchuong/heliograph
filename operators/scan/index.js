export default function (accumulate, initialValue) {
  return async function* (iterator) {
    let currentAccumulation = initialValue

    for await (const value of iterator) {
      yield (currentAccumulation = accumulate(currentAccumulation, value))
    }
  }
}
