import {fromQueue} from '../../index.js'

export default function (eventTarget, eventName, options) {
  const queue = fromQueue()

  eventTarget.addEventListener(
    eventName,
    (event) => {
      queue.push(event)
    },
    options,
  )

  return queue
}
