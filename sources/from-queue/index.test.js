// @flow
import test from 'ava'
import { promisify } from 'util'
import { fromQueue } from 'heliograph'

const sleep = promisify(setTimeout)

test('consuming and waiting for values from a queue', async t => {
  t.plan(4)

  const queue = fromQueue()

  await sleep(100)
  queue.push(1)
  queue.push(2)
  await sleep(100)
  queue.push(3)
  await sleep(100)
  queue.end()

  async function consume() {
    t.deepEqual(await queue.next(), { done: false, value: 1 })
    t.deepEqual(await queue.next(), { done: false, value: 2 })
    t.deepEqual(await queue.next(), { done: false, value: 3 })
    t.deepEqual(await queue.next(), { done: true })
  }
  await consume()
})

test('pushing errors', async t => {
  t.plan(1)

  const queue = fromQueue()

  await sleep(100)
  queue.pushError(new Error('Something went wrong'))

  async function consume() {
    await t.throwsAsync(queue.next(), 'Something went wrong')
  }
  await consume()
})
