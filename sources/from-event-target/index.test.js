import path from 'node:path'
import test from 'ava'
import {JSDOM} from 'jsdom'
import {closeTab, findElement, clickElement} from 'puppet-strings'
import openApp, {logger} from 'puppet-strings-open-app'
import fromEventTarget from './index.js'

test('queueing up DOM events in JSDOM', async (t) => {
  const dom = new JSDOM('<!DOCTYPE html><button></button>')
  const button = dom.window.document.querySelector('button')

  const iterator = fromEventTarget(button, 'click')

  button.click()
  button.click()

  t.like(await iterator.next(), {
    done: false,
    value: {type: 'click', target: button},
  })
  t.like(await iterator.next(), {
    done: false,
    value: {type: 'click', target: button},
  })
})

test('queueing up DOM events in a browser', async (t) => {
  logger.log({level: 'INFO', topic: 'test', message: 'start'})

  const testFilePath = new URL(import.meta.url).pathname

  const app = await openApp({
    path: path.dirname(testFilePath),
    files: {
      'index.html': `
        <!doctype html>
        <script type="module">
          import fromEventTarget from './index.js'
          
          const button = document.querySelector('button')
          const span = document.querySelector('span')

          const events = fromEventTarget(button, 'click')

          let count = 0
          for await (const event of events) {
            span.textContent = \`\${++count}\`
          }
        </script>
        <span>0</span>
        <button>Increment</button>
      `,
    },
  })
  t.teardown(async () => {
    await closeTab(app)
  })

  t.like(await findElement(app, 'span'), {textContent: '0'})

  await clickElement(await findElement(app, 'button'))
  t.like(await findElement(app, 'span'), {textContent: '1'})

  await clickElement(await findElement(app, 'button'))
  t.like(await findElement(app, 'span'), {textContent: '2'})
})
