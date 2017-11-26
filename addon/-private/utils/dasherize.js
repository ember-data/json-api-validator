const CACHE = Object.create(null);
const EXCESS_CAPS_REGEX = /([A-Z/])([A-Z]+)?/g;
const DASH_CAPS_REGEX = /^[A-Z]$/;

function replacer(_, $1, $2, index) {
  let p1 = $1;

  if (index !== 0 && DASH_CAPS_REGEX.test($1)) {
    p1 = '-' + $1;
  }

  return ($2 === undefined ? p1 : p1 + $2).toLowerCase();
}

function assert(msg, test) {
  if (!test) {
    throw new Error(msg);
  }
}

export default function dasherize(str) {
  assert(`Expected an argument of type string, received ${typeof str}`, typeof str === 'string');
  let s = CACHE[str];

  if (s === undefined) {
    s = CACHE[str] = str.replace(EXCESS_CAPS_REGEX, replacer);
  }

  return s;
}
