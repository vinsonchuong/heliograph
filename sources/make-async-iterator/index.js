export default function (properties) {
  return {
    [Symbol.asyncIterator]() {
      return this
    },
    ...properties
  }
}
