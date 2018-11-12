/* @flow */
import test from 'ava'
import { pipe, forEach } from 'heliograph'

test('iterating over the items of an async iterator', async t => {
  async function* numbers() {
    yield 1
    yield 2
  }

  t.plan(5)

  let expectedNumber = 1
  const iterator = pipe(
    numbers(),
    forEach(n => t.is(n, expectedNumber++))
  )

  t.deepEqual(await iterator.next(), { done: false, value: 1 })
  t.deepEqual(await iterator.next(), { done: false, value: 2 })
  t.deepEqual(await iterator.next(), { done: true, value: undefined })
})
