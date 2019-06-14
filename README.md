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

- supports **finer-grained [symbolic modes](symbolic)**, such as `+x`, `ug+rw`, and etc.
- supports **mode object** to make the mode better described.

## Install

```sh
$ npm i fs-chmod
```

## Usage

```js
const {
  chmod,
  chmodSync,
  parse
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
- **mode** `integer | Mode | string`
- **callback** `Function(error?)`

Changes the permissions of a file.

### parse(str): Mode

- **str** `string` Symbolic notation string of file system permissions

Parses the symbolic notation string, such as `+x`, `ug+rwx` into an object of the interface `Mode`(see below)

```js
const mode = parse('u+x')

console.log(mode.owner.execute)  // true
console.log(mode.owner.read)     // false
console.log(mode.group)         // undefined
```

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
  setuid?: boolean
  setgid?: boolean
  sticky?: boolean
}
```

For details, see [Symbolic modes](symbolic)


```sh
# bash
chmod ug+rst /path/to/file
```

is equivalent to

```js
chmodSync('path/to/file', 'ug+rst')

// or
chmodSync('path/to/file', {
  owner: {
    read: true
  },
  group: {
    read: true
  },
  setuid: true,
  setgid: true,
  sticky: true
})
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
[symbolic]: https://en.wikipedia.org/wiki/Chmod#Symbolic_modes
