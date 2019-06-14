

const fs = require('mz/fs')
const Mode = require('stat-mode')
const {isNumber, isString, isObject} = require('core-util-is')

// Returns
const normalizeString = (mode, str) => {

}

const normalizeObject = (mode, object) => {
  [
    'owner',
    'group',
    'others'
  ].forEach(key => {
    Object.assign(mode[key], object[key])
  })

  return mode.stat.mode
}

const normalize = (stat, rawMode) => {
  const mode = new Mode(stat)
  if (isString(rawMode)) {
    return normalizeString(mode, rawMode)
  }

  if (isObject(rawMode)) {
    return normalizeObject(mode, rawMode)
  }

  throw new TypeError(
    `mode should be of number, string or object, but got \`${rawMode}\``)
}

const prepare = async (file, rawMode) => {
  if (isNumber(rawMode)) {
    return rawMode
  }

  const stat = await fs.stat(file)
  return normalize(stat, rawMode)
}

const prepareSync = (file, rawMode) => {
  if (isNumber(rawMode)) {
    return rawMode
  }

  const stat = fs.statSync(file)
  return normalize(stat, rawMode)
}

const chmod = async (file, rawMode) => {
  const mode = await prepare(file, rawMode)
  return fs.chmod(file, mode)
}

const sync = (file, rawMode) => {
  const mode = prepareSync(file, rawMode)
  return fs.chmodSync(file, mode)
}

module.exports = function fsChmod (file, rawMode, callback) {
  const p = chmod(file, rawMode)

  if (arguments.length === 3) {
    p.then(
      () => callback(null),
      callback
    )
    return
  }

  return p
}

module.exports.sync = sync
