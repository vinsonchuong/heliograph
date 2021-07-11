/* eslint-disable no-unmodified-loop-condition, no-await-in-loop */

export default async function* (stream) {
  stream.pause()

  let ended = false
  stream.on('end', () => {
    ended = true
  })

  let error = null
  stream.on('error', (error_) => {
    error = error_
  })

  while (!ended && !error) {
    const data = stream.read()
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
  await new Promise((resolve) => {
    for (const event of events) {
      eventEmitter.once(event, resolve)
    }
  })
}
