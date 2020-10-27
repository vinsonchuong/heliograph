import test from 'ava'
import {fromQueue} from '../../index.js'
import zip from './index.js'

test('grouping together items from multiple iterators', async (t) => {
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

  t.deepEqual(await iterator.next(), {done: false, value: [1, 'a']})
  t.deepEqual(await iterator.next(), {done: false, value: [2, 'b']})
  t.deepEqual(await iterator.next(), {done: false, value: [3, 'c']})
  t.deepEqual(await iterator.next(), {done: true})
})

test('ending when the first iterator ends without emitting any items', async (t) => {
  const one = fromQueue()
  const two = fromQueue()

  const iterator = zip(one, two)

  one.end()
  two.push('a')

  t.deepEqual(await iterator.next(), {done: true})
})

test('ending when the second iterator ends without emitting any items', async (t) => {
  const one = fromQueue()
  const two = fromQueue()

  const iterator = zip(one, two)

  one.push(1)
  two.end()

  t.deepEqual(await iterator.next(), {done: true})
})

test('ending when the first iterator ends', async (t) => {
  const one = fromQueue()
  const two = fromQueue()

  const iterator = zip(one, two)

  one.push(1)
  one.end()

  two.push('a')
  two.push('b')

  t.deepEqual(await iterator.next(), {done: false, value: [1, 'a']})
  t.deepEqual(await iterator.next(), {done: true})
})

test('ending when the second iterator ends', async (t) => {
  const one = fromQueue()
  const two = fromQueue()

  const iterator = zip(one, two)

  one.push(1)
  one.push(2)

  two.push('a')
  two.end()

  t.deepEqual(await iterator.next(), {done: false, value: [1, 'a']})
  t.deepEqual(await iterator.next(), {done: true})
})

test('propagating errors thrown by the first iterator', async (t) => {
  const one = fromQueue()
  const two = fromQueue()

  const iterator = zip(one, two)

  one.pushError(new Error('Something Wrong'))

  await t.throwsAsync(iterator.next(), {message: 'Something Wrong'})
})

test('propagating errors thrown by the second iterator', async (t) => {
  const one = fromQueue()
  const two = fromQueue()

  const iterator = zip(one, two)

  two.pushError(new Error('Something Wrong'))

  await t.throwsAsync(iterator.next(), {message: 'Something Wrong'})
})
