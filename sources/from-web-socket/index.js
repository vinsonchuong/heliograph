import WebSocket from 'isomorphic-ws'
import pify from 'pify'
import {pEvent, pEventIterator} from 'p-event'
import {makeAsyncIterator} from '../../index.js'

export default async function (url) {
  const ws = new WebSocket(url, {
    rejectUnauthorized: new URL(url).hostname !== 'localhost',
  })

  ws.on('message', (message) => {
    if (typeof message === 'string') {
      ws.emit('parsed-message', message)
    } else {
      ws.emit('parsed-message', message.toString())
    }
  })

  const iterator = pEventIterator(ws, 'parsed-message', {
    resolutionEvents: ['close'],
    rejectionEvents: ['error'],
  })

  await pEvent(ws, 'open')

  return makeAsyncIterator({
    next: () => iterator.next(),
    send: pify(ws.send.bind(ws)),
    async close() {
      ws.close()
      await pEvent(ws, 'close')
    },
  })
}
