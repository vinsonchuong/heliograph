import test from 'ava'
import filter from './index.js'

test('transforming each element of an iterator', async (t) => {
  async function* numbers() {
    yield 1
    yield 2
    yield 3
  }

  const iterator = filter((n) => n % 2 === 0)(numbers())

  t.deepEqual(await iterator.next(), {done: false, value: 2})
  t.deepEqual(await iterator.next(), {done: true, value: undefined})
})
