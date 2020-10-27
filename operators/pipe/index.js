import flow from 'lodash/flow.js'

export default (arg, ...fns) => flow(fns)(arg)
