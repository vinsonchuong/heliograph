import path from 'node:path'
import test from 'ava'
import {closeTab, findElement} from 'puppet-strings'
import openApp, {logger} from 'puppet-strings-open-app'
import fromWebSocket from './index.js'

test('subscribing to a WebSocket feed', async (t) => {
  const socket = await fromWebSocket('wss://ws.postman-echo.com/raw')

  await socket.send('One')
  await socket.send('Two')
  await socket.close()

  const messages = []
  for await (const message of socket) {
    messages.push(message)
  }

  t.deepEqual(messages, ['One', 'Two'])
})

test('queueing up WebSocket messages in a browser', async (t) => {
  logger.log({level: 'INFO', topic: 'test', message: 'start'})

  const testFilePath = new URL(import.meta.url).pathname

  const app = await openApp({
    path: path.dirname(testFilePath),
    files: {
      'index.html': `
        <!doctype html>
        <script type="module">
          import fromWebSocket from './index.browser.js'

          const socket = await fromWebSocket('wss://ws.postman-echo.com/raw')

          socket.send('One')
          socket.send('Two')

          for await (const message of socket) {
            const span = document.createElement('span')
            span.textContent = event.data
            document.body.append(span)
          }

          await socket.close()
        </script>
      `,
    },
  })
  t.teardown(async () => {
    await closeTab(app)
  })

  await t.notThrowsAsync(findElement(app, 'span', 'One'))
  await t.notThrowsAsync(findElement(app, 'span', 'Two'))
})
