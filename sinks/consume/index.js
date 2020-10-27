export default function (processItem) {
  return async (iterator) => {
    for await (const item of iterator) {
      await processItem(item)
    }
  }
}
