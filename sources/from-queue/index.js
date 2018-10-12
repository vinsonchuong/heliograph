/* @flow */

export default function<T>(): AsyncIterator<T> & {
  push: T => void,
  pushError: Error => void,
  end: () => void
} {
  const queue = []
  let interrupt = null
  let error = null
  let ended = false

  // $FlowFixMe
  return {
    // $FlowFixMe
    [Symbol.asyncIterator]() {
      return this
    },

    async next() {
      if (queue.length === 0 && !ended && !error) {
        await new Promise(resolve => {
          interrupt = resolve
        })
        interrupt = null
      }

      if (error) {
        throw error
      }

      if (queue.length > 0) {
        return { done: false, value: queue.shift() }
      }

      if (ended) {
        return { done: true }
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
  }
}
