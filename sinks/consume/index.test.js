import test from 'ava'
import {pipe, consume} from '../../index.js'

test('iterating over the items of an async iterator', async (t) => {
  async function* numbers() {
    yield 1
    yield 2
  }

  t.plan(2)

  let expectedNumber = 1
  await pipe(
    numbers(),
    consume((n) => t.is(n, expectedNumber++))
  )
})
