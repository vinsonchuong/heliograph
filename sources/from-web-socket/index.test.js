/* @flow */
import test from 'ava'
import fromWebSocket from './'

test('subscribing to a WebSocket feed', async t => {
  const socket = await fromWebSocket<string, string>(
    'wss://echo.websocket.org/'
  )

  await socket.send('One')
  await socket.send('Two')
  await socket.close()

  const messages = []
  for await (const message of socket) {
    messages.push(message)
  }

  t.deepEqual(messages, ['One', 'Two'])
})
