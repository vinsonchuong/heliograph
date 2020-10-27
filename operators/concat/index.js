export default async function* (...iterators) {
  for (const iterator of iterators) {
    yield* iterator
  }
}
