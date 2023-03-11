import {fromQueue} from '../../index.js'

const waiting = Symbol('waiting')

export default function (values, sampler) {
  const samples = fromQueue()
  let currentValue = waiting

  async function readCurrentValue() {
    for await (const value of values) {
      currentValue = value
    }
  }

  async function takeSample() {
    // eslint-disable-next-line no-unused-vars
    for await (const _ of sampler) {
      if (currentValue !== waiting) {
        samples.push(currentValue)
        currentValue = waiting
      }
    }
  }

  readCurrentValue()
  takeSample()

  return samples
}
