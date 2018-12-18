# heliograph
![npm](https://img.shields.io/npm/v/heliograph.svg)
[![Build Status](https://travis-ci.org/vinsonchuong/heliograph.svg?branch=master)](https://travis-ci.org/vinsonchuong/heliograph)
[![dependencies Status](https://david-dm.org/vinsonchuong/heliograph/status.svg)](https://david-dm.org/vinsonchuong/heliograph)
[![devDependencies Status](https://david-dm.org/vinsonchuong/heliograph/dev-status.svg)](https://david-dm.org/vinsonchuong/heliograph?type=dev)

Tools to support message passing via async iterators

## Usage
Install [heliograph](https://yarnpkg.com/en/package/heliograph)
by running:

```sh
yarn add heliograph
```

### Sources

#### `makeAsyncIterator({ next, ...otherProperties })`
Manually define an async iterator

```js
import { makeAsyncIterator } from 'heliograph'

async function run() {
  let currentCount = 1
  const iterator = makeAsyncIterator({
    async next() {
      if (currentCount <= 3) {
        return { done: false, value: currentCount++ }
      } else {
        return { done: true }
      }
    },

    doSomethingElse() {
      console.log('Hello There')
    }
  })

  for await (const value of iterator) {
    console.log(value)
  }

  iterator.doSomethingElse()
}

run()
```

`.next()` is called whenever a consumer wants to pull the next value from the
iterator; it must return either `{ done: false, value: 'VALUE' }` or
`{ done: true }`.

Other properties that are passed in will be added to the returned iterator.

#### `fromQueue()`
Creates an async iterator that waits for and pulls values pushed into a queue

```js
import * as fs from 'fs'
import { promisify } from 'util'
import { fromQueue } from 'heliograph'

const sleep = promisify(setTimeout)

const queue = fromQueue()

async function produce() {
  queue.push(1)
  await sleep(1000)
  queue.push(2)
  await sleep(2000)
  queue.push(3)

  // queue.pushError(new Error('Something went wrong'))
  queue.end()
}

async function consume() {
  for await (const value of queue) {
    console.log(value)
  }
}

produce()
consume()
```

Push values into the queue using `.push(value)`. Values are buffered until they
are pulled out by a consumer. Signal to consumers that no more values will be
produced by calling `.end()`; any values still in the queue will be drained
first.

Signal an error condition by calling `.push(error)`. Any values in the queue
will be drained first. Subsequent attempts to pull values will throw the given
error.

#### `fromEventEmitter(eventEmitter, messageEventName, ?endEventName, ?errorEventName)`
Creates an async iterator that queues up events from an `EventEmitter`.

```js
import EventEmitter from 'events'
import { fromEventEmitter } from 'heliograph'

async function run() {
  const eventEmitter = new EventEmitter()
  const iterator = fromEventEmitter(eventEmitter, 'message', 'end', 'error')

  eventEmitter.emit('message', 1)
  eventEmitter.emit('message', 2)
  eventEmitter.emit('message', 3)
  eventEmitter.emit('end')

  // eventEmitter.emit('error', new Error('Something Wrong'))

  for await (const message of iterator) {
    console.log(message)
  }
}

run()
```

With semantics similar to [`fromQueue()`](#fromqueue), whenever a message event
is emitted, its value is enqueued. Optionally, an end event or error event can
be provided; when emitted, they are translated into calls to `.end()` and
`.pushError(error)`, respectively.

#### `fromStream(readableStream)`
Creates an async iterator that pulls values from a Readable Stream.

```js
import * as fs from 'fs'
import { fromStream } from 'heliograph'

async function run() {
  const stream = fs.createReadStream('some-file')
  for await (const chunk of fromStream(stream)) {
    console.log(chunk)
  }
}

run()
```

When the stream ends, the async interator will end. When the stream emits an
error, the async iterator will throw that error.

### Sinks

#### `consume(processItem)(iterator)`
Consume the items of the given async iterator

```js
import { pipe, consume } from 'heliograph'

async function* numbers() {
  yield 1
  yield 2
  yield 3
}

async function run() {
  await pipe(
    numbers(),
    consume(n => console.log(n))
  )
}

run()
```

`consume` returns a promise that resolves when the iterator ends and rejects
if it throws an error.

#### `toArray(iterator)`
Collect the items of the given async iterator into an array

```js
import { pipe, toArray } from 'heliograph'

async function* numbers() {
  yield 1
  yield 2
  yield 3
}

async function run() {
  const numbersArray = await pipe(
    numbers(),
    toArray
  )

  console.log(numbersArray)
}

run()
```

### Operators

#### `filter(include)(iterator)`
Return a new async iterator whose items are items from the given iterator that
evaluate to `true` when passed to the given inclusion function.

```js
import { filter } from 'heliograph'

async function* numbers() {
  yield 1
  yield 2
  yield 3
}

async function run() {
  const iterator = filter(n => n % 2 === 0)(numbers())
  for await (const evenNumber of iterator) {
    console.log(evenNumber)
  }
}
run()
```

#### `fork(iterator, times)`
Copy an async iterator so that separate operators can be applied

```js
import { fork, filter } from 'heliograph'

async function* numbers() {
  yield 1
  yield 2
  yield 3
}

async function run() {
  const [numbers1, numbers2] = fork(numbers(), 2)
  const evenNumbers = filter(n => n % 2 === 0)(numbers1)
  const oddNumbers = filter(n => n % 2 !== 0)(numbers2)
}
run()
```

#### `map(transform)(iterator)`
Return a new async iterator whose items are the result of transforming each item
of the given async iterator.

```js
import { map } from 'heliograph'

async function* numbers() {
  yield 1
  yield 2
  yield 3
}

async function run() {
  const iterator = map(n => n * 2)(numbers())
  for await (const doubledNumber of iterator) {
    console.log(doubledNumber)
  }
}
run()
```

#### `merge(...iterators)`
Interleave the items from multiple async iterators as they arrive

```js
import { promisify } from 'util'
import { merge } from 'heliograph'

const sleep = promisify(setTimeout)

async function* numbers() {
  yield 1
  yield 2
  yield 3
}

async function* otherNumbers() {
  yield 42
  yield 43
  yield 44
}

async function run() {
  const iterator = merge(numbers(), otherNumbers())
  for await (const number of iterator) {
    console.log(number)
  }
}

run()
```

#### `observe(iterator)(processItem)`
Observe the items of an async iterator and return a new async iterator that
yields the same items. Errors are not passed to the observer.

```js
import { pipe, observe } from 'heliograph'

async function* numbers() {
  yield 1
  yield 2
  yield 3
}

const iterator = pipe(
  numbers(),
  observe(n => console.log(n))
)

async function run() {
  for await (const number of iterator) {
    console.log(number)
  }
}

run()

```

### `pipe(iterator, ...transforms)`
Pass an iterator through a series of transforms.

```js
import { pipe, map, filter } from 'heliograph'

async function* numbers() {
  yield 1
  yield 2
  yield 3
  yield 4
}

async function run() {
  const iterator = pipe(
    numbers(),
    filter(number => number % 2 === 0),
    map(evenNumber => evenNumber * 3)
  )

  for await (const number of iterator) {
    console.log(number)
  }
}

run()
```

#### `zip(iterator1, iterator2)`
Pair up items from two async iterators

```js
import { promisify } from 'util'
import { zip } from 'heliograph'

const sleep = promisify(setTimeout)

async function* numbers() {
  yield 1
  yield 2
  yield 3
}

async function* letters() {
  yield 'a'
  yield 'b'
  yield 'c'
}

async function run() {
  const iterator = zip(numbers(), letters())
  for await (const [number, letter] of iterator) {
    console.log(number, leter)
  }
}

run()
```
