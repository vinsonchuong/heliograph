/* @flow */
import test from 'ava'
import greeting from 'heliograph'

test('exporting "Hello World!"', t => {
  t.is(greeting, 'Hello World!')
})
