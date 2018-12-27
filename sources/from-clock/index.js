/* @flow */
import { sleep } from 'heliograph/util'

export default async function* fromClock(
  interval: number
): AsyncIterator<number> {
  const nextTick = (Math.floor(Date.now() / interval) + 1) * interval
  await sleep(nextTick - Date.now())
  yield nextTick

  yield* fromClock(interval)
}
