/* @flow */
import type EventEmitter from 'events'
import { fromQueue } from 'heliograph'

export default function(eventEmitter: EventEmitter, eventName: string) {
  const queue = fromQueue()
  eventEmitter.on(eventName, message => {
    queue.push(message)
  })
  return queue
}
