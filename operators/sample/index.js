import {fromQueue} from '../../index.js'

const waiting = Symbol('waiting')

export default function (sampler) {
  const samples = fromQueue()
  let currentValue = waiting

  async function takeSample() {
    // eslint-disable-next-line no-unused-vars
    for await (const _ of sampler) {
      if (currentValue !== waiting) {
        samples.push(currentValue)
        currentValue = waiting
      }
    }
  }

  return (values) => {
    async function readCurrentValue() {
      for await (const value of values) {
        currentValue = value
      }
    }

    readCurrentValue()
    takeSample()

    return samples
  }
}
