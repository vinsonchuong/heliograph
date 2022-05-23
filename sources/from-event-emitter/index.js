import {fromQueue} from '../../index.js'

export default function (
  eventEmitter,
  eventName,
  endEventName,
  errorEventName,
) {
  const queue = fromQueue()

  eventEmitter.on(eventName, (message) => {
    queue.push(message)
  })

  if (endEventName) {
    eventEmitter.once(endEventName, () => {
      queue.end()
    })
  }

  if (errorEventName) {
    eventEmitter.once(errorEventName, (error) => {
      queue.pushError(error)
    })
  }

  return queue
}
