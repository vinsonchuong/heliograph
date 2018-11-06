/* @flow */
import type EventEmitter from 'events'
import { fromQueue } from 'heliograph'

export default function<Item>(
  eventEmitter: EventEmitter,
  eventName: string
): AsyncIterator<Item> {
  const queue = fromQueue<Item>()
  eventEmitter.on(eventName, message => {
    queue.push(message)
  })
  return queue
}
