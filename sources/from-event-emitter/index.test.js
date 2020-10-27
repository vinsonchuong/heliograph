import test from 'ava'
import EventEmitter from 'events'
import fromEventEmitter from './index.js'

test('queueing up events', async (t) => {
  const eventEmitter = new EventEmitter()
  const iterator = fromEventEmitter(eventEmitter, 'message')

  eventEmitter.emit('message', 1)
  eventEmitter.emit('message', 2)
  eventEmitter.emit('message', 3)

  t.deepEqual(await iterator.next(), {done: false, value: 1})
  t.deepEqual(await iterator.next(), {done: false, value: 2})
  t.deepEqual(await iterator.next(), {done: false, value: 3})
})

test('listening for an ending event', async (t) => {
  const eventEmitter = new EventEmitter()
  const iterator = fromEventEmitter(eventEmitter, 'message', 'end')

  eventEmitter.emit('message', 1)
  eventEmitter.emit('end')

  t.deepEqual(await iterator.next(), {done: false, value: 1})
  t.deepEqual(await iterator.next(), {done: true})
})

test('listening for an error event', async (t) => {
  const eventEmitter = new EventEmitter()
  const iterator = fromEventEmitter(eventEmitter, 'message', null, 'error')

  eventEmitter.emit('message', 1)
  eventEmitter.emit('error', new Error('Something went wrong'))

  t.deepEqual(await iterator.next(), {done: false, value: 1})
  await t.throwsAsync(iterator.next())
})
