import test from 'ava'
import {pipe, toArray} from '../../index.js'
import scan from './index.js'

test('accumulating values one at a time', async (t) => {
  async function* numbers() {
    yield 1
    yield 2
    yield 3
    yield 4
    yield 5
  }

  const groups = await pipe(
    numbers(),
    scan((acc, n) => acc + n, 0),
    toArray,
  )

  t.deepEqual(groups, [1, 3, 6, 10, 15])
})
