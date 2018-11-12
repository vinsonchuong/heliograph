import forkModule from './fork'
import forEachModule from './for-each'
import mergeModule from './merge'
import pipeModule from './pipe'
import zipModule from './zip'
import filterModule from './filter'
import mapModule from './map'

export const fork = forkModule.default
export const merge = mergeModule.default
export const pipe = pipeModule.default
export const zip = zipModule.default

export const filter = filterModule.default
export const forEach = forEach.default
export const map = mapModule.default
