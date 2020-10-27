export default async function (iterator) {
  const result = []
  for await (const item of iterator) {
    result.push(item)
  }

  return result
}
