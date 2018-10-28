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

  async function* letters() {
    yield 'a'
    await sleep(150)
    yield 'b'
    yield 'c'
  }

  const numbersIterator = numbers()
  const lettersIterator = letters()
  const iterator = merge(numbersIterator, lettersIterator)
  t.deepEqual(await iterator.next(), {
    done: false,
    value: { source: lettersIterator, value: 'a' }
  })
  t.deepEqual(await iterator.next(), {
    done: false,
    value: { source: numbersIterator, value: 1 }
  })
  t.deepEqual(await iterator.next(), {
    done: false,
    value: { source: numbersIterator, value: 2 }
  })
  t.deepEqual(await iterator.next(), {
    done: false,
    value: { source: lettersIterator, value: 'b' }
  })
  t.deepEqual(await iterator.next(), {
    done: false,
    value: { source: lettersIterator, value: 'c' }
  })
  t.deepEqual(await iterator.next(), {
    done: false,
    value: { source: numbersIterator, value: 3 }
  })
  t.deepEqual(await iterator.next(), { done: true })
})
