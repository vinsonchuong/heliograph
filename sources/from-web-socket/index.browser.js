import {pEvent, pEventIterator} from 'p-event'
import {makeAsyncIterator, pipe, map} from '../../index.js'

export default async function (url) {
  const ws = new WebSocket(url)

  const iterator = pipe(
    pEventIterator(ws, 'message', {
      resolutionEvents: ['close'],
      rejectionEvents: ['error'],
    }),
    map((messageEvent) => messageEvent.data),
  )

  await pEvent(ws, 'open')

  return makeAsyncIterator({
    next: () => iterator.next(),
    send: (...args) => ws.send(...args),
    async close() {
      ws.close()
      await pEvent(ws, 'close')
    },
  })
}
