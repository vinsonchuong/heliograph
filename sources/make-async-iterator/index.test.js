import test from 'ava'
import makeAsyncIterator from './index.js'

test('defining an async iterator', async (t) => {
  let currentValue = 1
  const iterator = makeAsyncIterator({
    async next() {
      if (currentValue <= 3) {
        return {done: false, value: currentValue++}
      }

      return {done: true}
    }
  })

  const values = []
  for await (const value of iterator) {
    values.push(value)
  }

  t.deepEqual(values, [1, 2, 3])
})
