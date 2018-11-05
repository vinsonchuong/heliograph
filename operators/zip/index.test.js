/* @flow */
import test from 'ava'
import zip from './'

test('grouping together items from multiple iterators', async t => {
  async function* numbers() {
    yield 1
    yield 2
    yield 3
  }

  async function* letters() {
    yield 'a'
    yield 'b'
    yield 'c'
  }

  const iterator = zip(numbers(), letters())

  t.deepEqual(await iterator.next(), { done: false, value: [1, 'a'] })
  t.deepEqual(await iterator.next(), { done: false, value: [2, 'b'] })
  t.deepEqual(await iterator.next(), { done: false, value: [3, 'c'] })
  t.deepEqual(await iterator.next(), { done: true })
})
