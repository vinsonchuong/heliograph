import test from 'ava'
import intoStream from 'into-stream'
import fromStream from './index.js'

test('converting a stream to an async iterator', async (t) => {
  const stream = intoStream.object([
    {word: 'foo'},
    {word: 'bar'},
    {word: 'baz'},
  ])

  const iterator = fromStream(stream)

  t.deepEqual(await iterator.next(), {done: false, value: {word: 'foo'}})
  t.deepEqual(await iterator.next(), {done: false, value: {word: 'bar'}})
  t.deepEqual(await iterator.next(), {done: false, value: {word: 'baz'}})
  t.deepEqual(await iterator.next(), {done: true, value: undefined})
})
