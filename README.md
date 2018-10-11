# heliograph
![npm](https://img.shields.io/npm/v/heliograph.svg)
[![Build Status](https://travis-ci.org/splayd/heliograph.svg?branch=master)](https://travis-ci.org/splayd/heliograph)
[![dependencies Status](https://david-dm.org/splayd/heliograph/status.svg)](https://david-dm.org/splayd/heliograph)
[![devDependencies Status](https://david-dm.org/splayd/heliograph/dev-status.svg)](https://david-dm.org/splayd/heliograph?type=dev)

Tools to support message passing via async iterators

## Usage
Install [heliograph](https://yarnpkg.com/en/package/heliograph)
by running:

```sh
yarn add heliograph
```

### Sources

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
