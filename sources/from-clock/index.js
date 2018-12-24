/* @flow */
import { promisify } from 'util'

const sleep = promisify(setTimeout)

export default async function* clock(interval: number): AsyncIterator<number> {
  const nextTick = (Math.floor(Date.now() / interval) + 1) * interval
  await sleep(nextTick - Date.now())
  yield nextTick

  yield* clock(interval)
}
