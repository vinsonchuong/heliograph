import {setTimeout} from 'node:timers/promises'
import test from 'ava'
import {fromQueue, fromClock} from '../../index.js'
import sample from './index.js'

test('sampling an async iterator at specific intervals', async (t) => {
  const values = fromQueue()
  const sampler = fromQueue()

  const samples = sample(values, sampler)

  values.push(1)
  await Promise.resolve()
  values.push(2)
  await Promise.resolve()
  sampler.push(true)
  await Promise.resolve()

  t.deepEqual(await samples.next(), {done: false, value: 2})

  sampler.push(true)
  await Promise.resolve()
  sampler.push(true)
  await Promise.resolve()
  values.push(3)
  await Promise.resolve()
  sampler.push(true)
  await Promise.resolve()

  t.deepEqual(await samples.next(), {done: false, value: 3})
})

test('sampling an async iterator at fixed time intervals', async (t) => {
  const values = fromQueue()
  const ms100 = fromClock(100)
  const samples = sample(values, ms100)

  await setTimeout(200)
  values.push(1)

  await setTimeout(100)
  values.push(2)
  values.push(3)
  await setTimeout(10)
  values.push(4)

  await setTimeout(100)

  t.deepEqual(await samples.next(), {done: false, value: 1})
  t.deepEqual(await samples.next(), {done: false, value: 4})
})
