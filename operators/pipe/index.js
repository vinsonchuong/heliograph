/* @flow */
/* eslint-disable flowtype/no-weak-types */
import { flow } from 'lodash'

type Pipe = (<Arg, Fn: Function>(Arg, Fn: Function) => $Call<Fn, Arg>) &
  (<Arg, Fn1: Function, Fn2: Function>(
    Arg,
    Fn1,
    Fn2
  ) => $Call<Fn2, $Call<Pipe, Arg, Fn1>>) &
  (<Arg, Fn1: Function, Fn2: Function, Fn3: Function>(
    Arg,
    Fn1,
    Fn2,
    Fn3
  ) => $Call<Fn3, $Call<Pipe, Arg, Fn1, Fn2>>) &
  (<Arg, Fn1: Function, Fn2: Function, Fn3: Function, Fn4: Function>(
    Arg,
    Fn1,
    Fn2,
    Fn3,
    Fn4
  ) => $Call<Fn4, $Call<Pipe, Arg, Fn1, Fn2, Fn3>>) &
  (<
    Arg,
    Fn1: Function,
    Fn2: Function,
    Fn3: Function,
    Fn4: Function,
    Fn5: Function
  >(
    Arg,
    Fn1,
    Fn2,
    Fn3,
    Fn4,
    Fn5
  ) => $Call<Fn5, $Call<Pipe, Arg, Fn1, Fn2, Fn3, Fn4>>) &
  (<
    Arg,
    Fn1: Function,
    Fn2: Function,
    Fn3: Function,
    Fn4: Function,
    Fn5: Function,
    Fn6: Function
  >(
    Arg,
    Fn1,
    Fn2,
    Fn3,
    Fn4,
    Fn5,
    Fn6
  ) => $Call<Fn6, $Call<Pipe, Arg, Fn1, Fn2, Fn3, Fn4, Fn5>>)

const pipe: Pipe = (arg, ...fns) => flow(fns)(arg)

export default pipe
