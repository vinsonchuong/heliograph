/* @flow */

export default function<T>(): AsyncIterator<T> & {
  push: T => void,
  end: () => void
} {
  const queue = []
  let interrupt = null
  let ended = false

  // $FlowFixMe
  return {
    // $FlowFixMe
    [Symbol.asyncInterator]() {
      return this
    },

    async next() {
      if (queue.length === 0 && !ended) {
        await new Promise(resolve => {
          interrupt = resolve
        })
        interrupt = null
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

    end() {
      ended = true
      if (interrupt) {
        interrupt()
      }
    }
  }
}
