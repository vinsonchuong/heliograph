/* @flow */
import test from 'ava'
import { fork } from 'heliograph'

test('creating copies of an iterator', async t => {
  async function* numbers() {
    yield 1
    yield 2
  }

  const [numbers1, numbers2, numbers3] = fork(numbers(), 3)

  t.deepEqual(await numbers1.next(), { done: false, value: 1 })
  t.deepEqual(await numbers2.next(), { done: false, value: 1 })
  t.deepEqual(await numbers3.next(), { done: false, value: 1 })

  t.deepEqual(await numbers1.next(), { done: false, value: 2 })
  t.deepEqual(await numbers2.next(), { done: false, value: 2 })
  t.deepEqual(await numbers3.next(), { done: false, value: 2 })

  t.deepEqual(await numbers1.next(), { done: true })
  t.deepEqual(await numbers2.next(), { done: true })
  t.deepEqual(await numbers3.next(), { done: true })
})

test('propagating errors', async t => {
  async function* numbers() {
    yield 1
    throw new Error('Something Wrong')
  }

  const [numbers1, numbers2] = fork(numbers(), 2)

  t.deepEqual(await numbers1.next(), { done: false, value: 1 })
  await t.throwsAsync(numbers1.next(), 'Something Wrong')

  t.deepEqual(await numbers2.next(), { done: false, value: 1 })
  await t.throwsAsync(numbers2.next(), 'Something Wrong')
})
