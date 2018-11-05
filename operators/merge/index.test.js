/* @flow */
import test from 'ava'
import { promisify } from 'util'
import merge from './'

const sleep = promisify(setTimeout)

test('merging async iterators', async t => {
  async function* numbers() {
    await sleep(100)
    yield 1
    yield 2
    await sleep(100)
    yield 3
  }

  async function* otherNumbers() {
    yield 42
    await sleep(150)
    yield 43
    yield 44
  }

  const numbersIterator = numbers()
  const otherNumbersIterator = otherNumbers()
  const iterator = merge(numbersIterator, otherNumbersIterator)

  t.deepEqual(await iterator.next(), { done: false, value: 42 })
  t.deepEqual(await iterator.next(), { done: false, value: 1 })
  t.deepEqual(await iterator.next(), { done: false, value: 2 })
  t.deepEqual(await iterator.next(), { done: false, value: 43 })
  t.deepEqual(await iterator.next(), { done: false, value: 44 })
  t.deepEqual(await iterator.next(), { done: false, value: 3 })
  t.deepEqual(await iterator.next(), { done: true })
})
