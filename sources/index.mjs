import makeAsyncIteratorModule from './make-async-iterator'
import fromQueueModule from './from-queue'
import fromEventEmitterModule from './from-event-emitter'
import fromStreamModule from './from-stream'
import fromClockModule from './from-clock'
import fromWebSocketModule from './from-web-socket'

export const makeAsyncIterator = makeAsyncIteratorModule.default
export const fromQueue = fromQueueModule.default
export const fromEventEmitter = fromEventEmitterModule.default
export const fromStream = fromStreamModule.default
export const fromClock = fromClockModule.default
export const fromWebSocket = fromWebSocketModule.default
