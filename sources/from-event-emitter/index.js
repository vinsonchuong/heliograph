/* @flow */
import type EventEmitter from 'events'
import { fromQueue } from 'heliograph'

export default function<Item>(eventEmitter: EventEmitter, eventName: string) {
  const queue = fromQueue<Item>()
  eventEmitter.on(eventName, message => {
    queue.push(message)
  })
  return queue
}
