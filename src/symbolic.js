const PLUS = '+'
const MINUS = '-'
const EQUAL = '='

const makeBoolKey = (bool, target, keys) => {
  keys.forEach(key => {
    target[key] = bool
  })
}

const OPERATORS = {
  [PLUS]: (target, keys) => {
    makeBoolKey(true, target, keys)
  },

  [MINUS]: (target, keys) => {
    makeBoolKey(false, target, keys)
  },

  [EQUAL]: (target, keys, range) => {
    range.forEach(key => {
      target[key] = keys.includes(key)
    })
  }
}

const REFERENCE_TYPES = [
  'user',
  'group',
  'others'
]

const NORMAL_MODE_TYPES = [
  'read',
  'write',
  'execute'
]

const MODE_PRESETS = {
  r: {
    key: 'read'
  },
  w: {
    key: 'write'
  },
  x: {
    key: 'execute'
  },
  s: {
    mutator (Mode, operator) {
      if (Mode.user) {
        Mode.setuid = operator === MINUS
      }

      if (Mode.group) {
        Mode.setgid = operator === MINUS
      }
    }
  },
  t: {
    group: 2,
    mutator (Mode, operator) {
      Mode.sticky = operator === MINUS
    }
  }
}

const createAddRef = type => Mode => {
  Mode[type] = Object.create(null)
}

const u = createAddRef('user')
const g = createAddRef('group')
const o = createAddRef('others')

const REFERENCE_MUTATORS = {
  u,
  g,
  o,
  a (stat) {
    u(stat)
    g(stat)
    o(stat)
  }
}

const REGEX_OPERATOR = /-|=|\+/g

const invalidFileMode = symbol => {
  const err = new RangeError(`[fs-chmod] invalid file mode: ${symbol}`)
  err.code = 'INVALID_FILE_MODE'
  return err
}

const parse = symbolic => {
  const invalid = () => {
    throw invalidFileMode(symbolic)
  }

  const [
    reference,
    mode
  // We allow symbolic notation with more then one operators:
  // a+x+x
  // The second operator and the following charactors will be ignored
  ] = symbolic.split(REGEX_OPERATOR)

  if (!mode) {
    invalid()
  }

  const references = reference
    ? reference.split('')
    : ['a']

  const Mode = Object.create(null)

  references.forEach(ref => {
    const mutator = REFERENCE_MUTATORS[ref]
    if (!mutator) {
      invalid()
    }

    mutator(Mode)
  })

  const operator = symbolic.charAt(reference.length)
  const modes = mode.split('')
  const keys = []

  modes.forEach(m => {
    const preset = MODE_PRESETS[m]

    if (!preset) {
      invalid()
    }

    const {
      key,
      mutator
    } = preset

    if (key) {
      keys.push(key)
      return
    }

    mutator(Mode, operator)
  })

  REFERENCE_TYPES.forEach(type => {
    const permission = Mode[type]
    if (!permission) {
      return
    }

    OPERATORS[operator](permission, keys, NORMAL_MODE_TYPES)
  })
}

module.exports = parse
