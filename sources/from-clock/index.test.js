import test from 'ava'
import fromClock from './index.js'

test('ticking at the given interval length', async (t) => {
  const interval = 1 * 1000

  let iterations = 3

  for await (const tick of fromClock(interval)) {
    t.is(tick.valueOf() % interval, 0)
    t.true(Date.now() >= tick.valueOf())
    t.true(Date.now() - tick.valueOf() < 10)

    if (--iterations === 0) break
  }
})
