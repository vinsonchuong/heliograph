import {sleep} from '../../util/index.js'

export default async function* fromClock(interval) {
  const nextTick = (Math.floor(Date.now() / interval) + 1) * interval
  await sleep(nextTick - Date.now())
  yield nextTick

  yield* fromClock(interval)
}
