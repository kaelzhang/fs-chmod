[![Build Status](https://travis-ci.org/kaelzhang/fs-chmod.svg?branch=master)](https://travis-ci.org/kaelzhang/fs-chmod)
[![Coverage](https://codecov.io/gh/kaelzhang/fs-chmod/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/fs-chmod)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/fs-chmod?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/fs-chmod)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/fs-chmod.svg)](http://badge.fury.io/js/fs-chmod)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/fs-chmod.svg)](https://www.npmjs.org/package/fs-chmod)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/fs-chmod.svg)](https://david-dm.org/kaelzhang/fs-chmod)
-->

# fs-chmod

A drop in replacement of [`fs.chmod`](chmod) with `+x` support.

## Install

```sh
$ npm i fs-chmod
```

## Usage

```js
const {
  chmod,
  chmodSync
} = require('fs-chmod')

chmod('/path/to/file.js', '+x').then(() => {
  console.log('done')
})

chmodSync.sync('/path/to/file.js', 'a+x')
```

### chmod(path, mode): Promise
### chmod(path, mode, callback): void
### chmodSync(path, mode): void

- **path** `string | Buffer | URL` the same as vanilla [`fs.chmod`](chmod)
- **mode** `integer | object | string`
- **callback** `Function(error?)`

Changes the permissions of a file.

## mode

### mode `integer`

The same as the the second parameter of vanilla [`fs.chmod`](chmod)

### mode `object<Mode>`

```ts
interface Permission {
  read?: boolean
  write?: boolean
  execute?: boolean
}

interface Mode {
  owner?: Permission
  group?: Permission
  others?: Permission
}
```

### mode `string`

```
[references][operator][modes]
```

- Supported references: `u`, `g`, `o`, `a`
- Supported operators: `+`, `=`, `-`
- Supported modes:
  - `r`, `w`, `x`
  <!-- - `X`: special execute -->
  - `s`: setuid/setgid
  - `t`: sticky

## License

[MIT](LICENSE)

[chmod]: https://nodejs.org/dist/latest/docs/api/fs.html#fs_fs_chmod_path_mode_callback
