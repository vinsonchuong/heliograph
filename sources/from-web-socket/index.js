/* @flow */
import WebSocket from 'isomorphic-ws'
import pify from 'pify'
import { parse as parseUrl } from 'url'
import pEvent from 'p-event'
import { makeAsyncIterator } from 'heliograph'

export default async function<OutgoingMessage, IncomingMessage>(
  url: string
): Promise<
  AsyncIterator<IncomingMessage> & {
    send: OutgoingMessage => Promise<void>,
    close: () => Promise<void>
  }
> {
  const ws = new WebSocket(url, {
    rejectUnauthorized: parseUrl(url).hostname !== 'localhost'
  })
  await pEvent(ws, 'open')

  const iterator = pEvent.iterator(ws, 'message', {
    resolutionEvents: ['close'],
    rejectionEvents: ['error']
  })

  return makeAsyncIterator({
    next: () => iterator.next(),
    send: pify(ws.send.bind(ws)),
    close: async () => {
      ws.close()
      await pEvent(ws, 'close')
    }
  })
}
