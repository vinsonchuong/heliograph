/* @flow */
import test from 'ava'
import EventEmitter from 'events'
import fromEventEmitter from './'

test('queueing up events', async t => {
  const eventEmitter = new EventEmitter()
  const iterator = fromEventEmitter(eventEmitter, 'message')

  eventEmitter.emit('message', 1)
  eventEmitter.emit('message', 2)
  eventEmitter.emit('message', 3)

  t.deepEqual(await iterator.next(), { done: false, value: 1 })
  t.deepEqual(await iterator.next(), { done: false, value: 2 })
  t.deepEqual(await iterator.next(), { done: false, value: 3 })
})
