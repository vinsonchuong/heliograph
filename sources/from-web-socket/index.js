import WebSocket from 'isomorphic-ws'
import pify from 'pify'
import pEvent from 'p-event'
import {makeAsyncIterator} from '../../index.js'

export default async function (url) {
  const ws = new WebSocket(url, {
    rejectUnauthorized: new URL(url).hostname !== 'localhost'
  })

  const iterator = pEvent.iterator(ws, 'message', {
    resolutionEvents: ['close'],
    rejectionEvents: ['error']
  })

  await pEvent(ws, 'open')

  return makeAsyncIterator({
    next: () => iterator.next(),
    send: pify(ws.send.bind(ws)),
    close: async () => {
      ws.close()
      await pEvent(ws, 'close')
    }
  })
}
