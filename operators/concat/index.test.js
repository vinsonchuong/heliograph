import test from 'ava'
import {concat, pipe, toArray} from '../../index.js'

test('concatenating two async iterators', async (t) => {
  async function* one() {
    yield 1
    yield 2
  }

  async function* two() {
    yield 3
    yield 4
  }

  const result = await pipe(concat(one(), two()), toArray)

  t.deepEqual(result, [1, 2, 3, 4])
})
