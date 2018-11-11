/* @flow */
import type EventEmitter from 'events'
import { fromQueue } from 'heliograph'

export default function<Item>(
  eventEmitter: EventEmitter,
  eventName: string,
  endEventName: ?string,
  errorEventName: ?string
): AsyncIterator<Item> {
  const queue = fromQueue<Item>()

  eventEmitter.on(eventName, message => {
    queue.push(message)
  })

  if (endEventName) {
    eventEmitter.once(endEventName, () => {
      queue.end()
    })
  }

  if (errorEventName) {
    eventEmitter.once(errorEventName, error => {
      queue.pushError(error)
    })
  }

  return queue
}
