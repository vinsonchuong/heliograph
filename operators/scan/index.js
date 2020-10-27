export default function (windowSize, transform) {
  return async function* (iterator) {
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
