import test from 'ava'
import map from './index.js'

test('transforming each element of an iterator', async (t) => {
  async function* numbers() {
    yield 1
    yield 2
    yield 3
  }

  const iterator = map((n) => 2 * n)(numbers())

  t.deepEqual(await iterator.next(), {done: false, value: 2})
  t.deepEqual(await iterator.next(), {done: false, value: 4})
  t.deepEqual(await iterator.next(), {done: false, value: 6})
  t.deepEqual(await iterator.next(), {done: true, value: undefined})
})
