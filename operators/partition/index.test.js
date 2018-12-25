/* @flow */
import test from 'ava'
import { pipe, toArray } from 'heliograph'
import partition from './'

test('partitioning items into groups', async t => {
  async function* streamItems() {
    yield { group: 1 }
    yield { group: 1 }
    yield { group: 2 }
    yield { group: 3 }
    yield { group: 3 }
    yield { group: 3 }
  }

  const groups = await pipe(
    streamItems(),
    partition((x, y) => x.group !== y.group),
    toArray
  )

  t.deepEqual(groups, [
    [{ group: 1 }, { group: 1 }],
    [{ group: 2 }],
    [{ group: 3 }, { group: 3 }, { group: 3 }]
  ])
})
