import fromQueueModule from './from-queue'
import fromEventEmitterModule from './from-event-emitter'
import fromStreamModule from './from-stream'

export const fromQueue = fromQueueModule.default
export const fromEventEmitter = fromEventEmitterModule.default
export const fromStream = fromStreamModule.default
