

const fs = require('mz/fs')
const Mode = require('stat-mode')
const {isNumber, isString, isObject} = require('core-util-is')
const hasOwnProp = require('has-own-prop')

const parse = require('./symbolic')

const PERMISSION_TYPES = [
  'owner',
  'group',
  'others'
]

// https://en.wikipedia.org/wiki/Chmod#Special_modes
const SPECIAL_MODES = [
  'setuid',
  'setgid',
  'sticky'
]

const normalizeObject = (mode, object) => {
  PERMISSION_TYPES.forEach(key => {
    Object.assign(mode[key], object[key])
  })

  SPECIAL_MODES.forEach(key => {
    if (hasOwnProp(object, key)) {
      mode[key] = object[key]
    }
  })

  return mode.stat.mode
}

const normalize = (stat, rawMode) => {
  const mode = new Mode(stat)
  if (isString(rawMode)) {
    return normalizeObject(mode, parse(rawMode))
  }

  if (isObject(rawMode)) {
    return normalizeObject(mode, rawMode)
  }

  throw new TypeError(
    `mode should be of number, string or object, but got \`${rawMode}\``)
}

const prepare = async (file, rawMode) => {
  if (isNumber(rawMode)) {
    return parseInt(rawMode, 8)
  }

  const stat = await fs.stat(file)
  return normalize(stat, rawMode)
}

const prepareSync = (file, rawMode) => {
  if (isNumber(rawMode)) {
    return parseInt(rawMode, 8)
  }

  const stat = fs.statSync(file)
  return normalize(stat, rawMode)
}

const chmodPromise = async (file, rawMode) => {
  const mode = await prepare(file, rawMode)
  return fs.chmod(file, mode)
}

const chmodSync = (file, rawMode) => {
  const mode = prepareSync(file, rawMode)
  return fs.chmodSync(file, mode)
}

function chmod (file, rawMode, callback) {
  const p = chmodPromise(file, rawMode)

  if (arguments.length === 3) {
    p.then(
      () => callback(null),
      callback
    )
    return
  }

  return p
}

module.exports = {
  chmod,
  chmodSync,
  parse
}
