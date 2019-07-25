/* @flow */
import WebSocket from 'isomorphic-ws'
import pEvent from 'p-event'
import { makeAsyncIterator, pipe, map } from 'heliograph'

export default async function<OutgoingMessage, IncomingMessage>(
  url: string
): Promise<
  AsyncIterator<IncomingMessage> & {
    send: OutgoingMessage => Promise<void>,
    close: () => Promise<void>
  }
> {
  const ws = new WebSocket(url)

  const iterator = pipe(
    pEvent.iterator(ws, 'message', {
      resolutionEvents: ['close'],
      rejectionEvents: ['error']
    }),
    map(messageEvent => messageEvent.data)
  )

  await pEvent(ws, 'open')

  return makeAsyncIterator({
    next: () => iterator.next(),
    send: (...args) => ws.send(...args),
    close: async () => {
      ws.close()
      await pEvent(ws, 'close')
    }
  })
}
