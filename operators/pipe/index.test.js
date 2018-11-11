/* @flow */
import test from 'ava'
import { pipe, map, filter } from 'heliograph'

test('piping an iterator into a series of operators', async t => {
  async function* numbers() {
    yield 1
    yield 2
    yield 3
    yield 4
    yield 5
  }

  const iterator = pipe(
    numbers(),
    filter(n => n % 2 !== 0),
    map(n => 3 * n)
  )

  t.deepEqual(await iterator.next(), { done: false, value: 3 })
  t.deepEqual(await iterator.next(), { done: false, value: 9 })
  t.deepEqual(await iterator.next(), { done: false, value: 15 })
  t.deepEqual(await iterator.next(), { done: true, value: undefined })
})
