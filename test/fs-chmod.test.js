const test = require('ava')
const tmp = require('tmp-promise')
const fs = require('mz/fs')
const path = require('path')
const {sync} = require('cross-spawn')
const Mode = require('stat-mode')
// const log = require('util').debuglog('fs-chmod')
const {
  chmod,
  chmodSync
} = require('../src')

const runners = [
  ['chmod', chmod],
  ['chmod.sync', chmodSync],
  ['chmod.cb', (file, mode) => new Promise((resolve, reject) => {
    chmod(file, mode, err => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })]
]

let dir
let count = 0

const prepare = async mode => {
  if (!dir) {
    dir = tmp.dirSync().name
  }

  let file = path.join(dir, String(count ++))
  await fs.writeFile(file, '')
  file = await fs.realpath(file)
  sync('chmod', [String(mode), file])
  return file
}

const CASES = [
  [
    '777', '-x', (t, mode) => {
      t.is(mode.owner.execute, false)
      t.is(mode.group.execute, false)
      t.is(mode.others.execute, false)
    }
  ],
  [
    '777', 775, (t, mode) => {
      t.is(mode.others.read, true)
      t.is(mode.others.write, false)
      t.is(mode.others.execute, true)
    }
  ],
  [
    '777', {
      owner: {
        execute: false
      }
    }, (t, mode) => {
      t.is(mode.owner.execute, false)
    }
  ],
  [
    '777', 'ug+s', (t, mode) => {
      t.is(mode.setuid, true)
      t.is(mode.setgid, true)
    }
  ]
]

CASES.forEach(([initMode, mode, tester]) => {
  runners.forEach(([type, runner]) => {
    test(`${type}: ${initMode} -> ${mode}`, async t => {
      const file = await prepare(initMode)
      await runner(file, mode)
      const stat = await fs.stat(file)
      const m = new Mode(stat)
      tester(t, m)
    })
  })
})

test('mode type error', async t => {
  const file = await prepare(777)
  t.throws(() => chmodSync(file, undefined), TypeError)
})
