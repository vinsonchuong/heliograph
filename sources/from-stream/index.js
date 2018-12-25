/* eslint-disable no-unmodified-loop-condition, flowtype/no-weak-types */
/* @flow */
import type { Readable } from 'stream'

export default async function* /*:: <Item> */ ( /* eslint-disable-line */
  stream: Readable
): AsyncIterator<Item> {
  stream.pause()

  let ended = false
  stream.on('end', () => {
    ended = true
  })

  let error = null
  stream.on('error', err => {
    error = err
  })

  while (!ended && !error) {
    const data = (stream.read(): any)
    if (data) {
      yield data
    } else {
      await waitForEvent(stream, ['readable', 'end', 'error'])
    }
  }

  if (error) {
    throw error
  }
}

async function waitForEvent(eventEmitter, events) {
  await new Promise(resolve => {
    for (const event of events) {
      eventEmitter.once(event, resolve)
    }
  })
}
