/* eslint-disable no-async-promise-executor */
import {makeAsyncIterator} from '../../index.js'

export default function (iterator1, iterator2) {
  return makeAsyncIterator({
    async next() {
      const promise1 = iterator1.next()
      const promise2 = iterator2.next()

      return Promise.race([
        new Promise(async (resolve, reject) => {
          try {
            const {done} = await promise1
            if (done) resolve({done: true})
          } catch (error) {
            reject(error)
          }
        }),

        new Promise(async (resolve, reject) => {
          try {
            const {done} = await promise2
            if (done) resolve({done: true})
          } catch (error) {
            reject(error)
          }
        }),

        (async function () {
          const item1 = await promise1
          const item2 = await promise2

          if (item1.value && item2.value) {
            return {done: false, value: [item1.value, item2.value]}
          }

          return {done: true}
        })(),
      ])
    },
  })
}
