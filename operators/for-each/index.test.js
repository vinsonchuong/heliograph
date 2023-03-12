import test from 'ava'
import {pipe, forEach} from '../../index.js'

test('iterating over the items of an async iterator', async (t) => {
  async function* numbers() {
    yield 1
    yield 2
  }

  t.plan(3)

  let expectedNumber = 1
  await pipe(
    numbers(),
    forEach((n) => t.is(n, expectedNumber++)),
  )
  t.pass()
})
