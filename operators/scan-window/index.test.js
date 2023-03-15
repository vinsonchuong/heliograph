import test from 'ava'
import {pipe, toArray} from '../../index.js'
import scanWindow from './index.js'

test('reducing over a running window', async (t) => {
  async function* stream() {
    yield 1
    yield 2
    yield 3
    yield 4
    yield 5
    yield 6
  }

  const groups = await pipe(
    stream(),
    scanWindow(2, ([x, y]) => x + y),
    toArray,
  )

  t.deepEqual(groups, [null, 3, 5, 7, 9, 11])
})
