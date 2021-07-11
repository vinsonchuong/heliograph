export default function (predicate) {
  return async function* (iterator) {
    let currentGroup = []

    for await (const item of iterator) {
      if (
        currentGroup.length > 0 &&
        predicate(currentGroup[currentGroup.length - 1], item)
      ) {
        yield currentGroup
        currentGroup = []
      }

      currentGroup.push(item)
    }

    yield currentGroup
  }
}
