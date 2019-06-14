const test = require('ava')
// const log = require('util').debuglog('fs-chmod')
const parse = require('../src/symbolic')

const CASES = [
  ['+x', {
    owner: {
      execute: true
    },
    group: {
      execute: true
    },
    others: {
      execute: true
    }
  }],
  ['u-r', {
    owner: {
      read: false
    }
  }],
  ['o=rw', {
    others: {
      read: true,
      write: true,
      execute: false
    }
  }],
  ['u+s', {
    owner: {},
    setuid: true
  }],
  ['ug-s', {
    owner: {},
    group: {},
    setuid: false,
    setgid: false
  }],
  ['-s', {
    owner: {},
    group: {},
    others: {},
    setuid: false,
    setgid: false
  }],
  ['u-t', {
    owner: {},
    sticky: false
  }],
  // actually useless
  ['o+s', {
    others: {}
  }]
]

CASES.forEach(([mode, parsed]) => {
  test(mode, t => {
    t.deepEqual(parsed, parse(mode))
  })
})

const INVALID = [
  'x',
  'b+x',
  'a+l'
]

INVALID.forEach(mode => {
  test(`invalid: ${mode}`, t => {
    t.throws(() => parse(mode))
  })
})
