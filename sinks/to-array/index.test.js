/* @flow */
import test from 'ava'
import { pipe, toArray } from 'heliograph'

test('collecting items into an array', async t => {
  async function* numbers() {
    yield 1
    yield 2
    yield 3
  }

  const result = await pipe(
    numbers(),
    toArray
  )

  t.deepEqual(result, [1, 2, 3])
})
