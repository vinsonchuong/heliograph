import {makeAsyncIterator} from '../../index.js'

export default function () {
  const queue = []
  let interrupt = null
  let error = null
  let ended = false

  return makeAsyncIterator({
    async next() {
      if (queue.length === 0 && !ended && !error) {
        await new Promise((resolve) => {
          interrupt = resolve
        })
        interrupt = null
      }

      if (queue.length > 0) {
        return {done: false, value: queue.shift()}
      }

      if (error) {
        throw error
      } else {
        return {done: true}
      }
    },

    push(value) {
      queue.push(value)
      if (interrupt) {
        interrupt()
      }
    },

    pushError(err) {
      error = err
      if (interrupt) {
        interrupt()
      }
    },

    end() {
      ended = true
      if (interrupt) {
        interrupt()
      }
    }
  })
}
