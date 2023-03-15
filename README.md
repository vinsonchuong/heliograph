# heliograph
![npm](https://img.shields.io/npm/v/heliograph.svg)
[![CI Status](https://github.com/vinsonchuong/heliograph/workflows/CI/badge.svg)](https://github.com/vinsonchuong/heliograph/actions?query=workflow%3ACI)
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

#### `fromClock(interval)`
Creates an async iterator that ticks after every interval.

```js
import { fromClock } from 'heliograph'

async function run() {
  for await(const hour of fromClock(1000 * 60 * 60)) {
    console.log(hour)
  }
}

run()
```

For example, when set to tick every hour (an interval of `1000 * 60 * 60`),
ticks will be emitted every hour on the hour starting with the next nearest
hour. So, if the current time is 10:30, the first tick will be at 11:00 and
then at 12:00.

Values cannot be emitted exactly on time but are guaranteed not to be emitted
early. From testing, the longest delay seen has been 10ms.

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

#### `fromEventTarget(eventTarget, eventName, options?)`
Creates an async iterator that queues up events from an
[`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget),
commonly used by DOM objects.

```js
import { fromEventTarget } from 'heliograph'

async function run() {
  const button = document.createElement('button')
  const iterator = fromEventEmitter(button, 'click', { passive: true })

  button.click()
  button.click()

  for await (const message of iterator) {
    console.log(message)
  }
}

run()
```

An optional third argument, when given, will be passed directly to
[`EventTarget.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener).

With semantics similar to [`fromQueue()`](#fromqueue), whenever a message event
is emitted, its value is enqueued.

#### `fromStream(readableStream)`
Creates an async iterator that pulls values from a Readable Stream.

Note that as of Node v11.14.0, `stream.Readable` instances are async iterators.
So, there's no need to convert them. However, many third-party libraries don't
yet include this interface change.

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

#### `fromWebSocket(url)`
Creates an async iterator that connects to the given URL and emits incoming
messages.

```js
import { fromWebSocket } from 'heliograph'

async function run() {
  const socket = await fromWebSocket('wss://echo.websocket.org/')

  await socket.send('One')
  await socket.send('Two')
  await socket.close()

  for await (const message of socket) {
    console.log(message)
  }
}

run()
```

The iterator will end when either the client or server disconnects.

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


#### `concat(...iterators)`
Return a new async iterator that emits all of the items of the first given
iterator, followed by all of the items of the next, etc.

```js
import { concat } from 'heliograph'

async function* numbersA() {
  yield 1
  yield 2
}

async function* numbersB() {
  yield 1
  yield 2
}

async function run() {
  const allNumbers = concat(numbersA(), numbersB())

  for await (const number of allNumbers) {
    console.log(number)
  }
}

run()
```

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

#### `observe(processItem)(iterator)`
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

#### `partition(predicate)(iterator)`
Break up an iterator's items into a series of groups

```js
import { partition } from 'heliograph'

async function* streamItems() {
  yield { group: 1 }
  yield { group: 1 }
  yield { group: 2 }
  yield { group: 3 }
  yield { group: 3 }
  yield { group: 3 }
}

async function run() {
  const groups = partition((x, y) => x.group !== y.group)(streamItems())

  for await (const group of groups) {
    console.log(group)
  }
}

run()
```

#### `pipe(iterator, ...transforms)`
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

#### `sample(scheduleIterator)(valueIterator)`
Downsample the values of an async iterator based on when and how often a
scheduler async iterator emits ticks.

```javascript
import { fromEventTarget, fromClock, pipe, sample } from 'heliograph'

const div = document.querySelector('div')

const throttledMouseMoves = pipe(
  fromEventEmitter(div, 'mousemove', { passive: true }),
  sample(fromClock(100))
)

for await(const event of throttledMouseMoves) {
  console.log(event)
}
```

#### `scanWindow(windowSize, transform)(iterator)`
Compute values from a rolling window

```javascript
import { scanWindow } from 'heliograph'

async function* numbers() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
}

async function run() {
  const addedNumbers = scanWindow(3, (x, y, z) => x + y + z)(numbers())

  for await (const addedNumber of addedNumbers) {
    console.log(addedNumber)
  }
}

run()
```

Note that for a given `windowSize`, the first `windowSize - 1` items emitted
will be `null`.

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
