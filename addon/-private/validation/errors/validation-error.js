export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

let _ERROR_ID = 0;

export function uniqueErrorId() {
  return _ERROR_ID++;
}

export function createNiceErrorMessage(propertyName = '', value = undefined, path = '', errorOnKey = false) {
  const parts = path.split('.').filter(i => i !== '');
  let message = "\n\n\t{\n\t";
  let depth = 2;

  for (let i = 0; i < parts.length; i++) {
    message += `${padLeft(parts[i], depth)}: {\n\t`;
    depth += 2;
  }

  message += `${padLeft(propertyName, depth)}: ${typeof value === 'string' ? "'" + value + "'" : value}\n\t`;

  if (errorOnKey === false) {
    depth += propertyName.length + 2;
  }

  message += `${padLeft('^', depth, '-')}\n\n`;

  return message;
}

function padLeft(str, count = 0, char = ' ') {
  let s = '';

  while (count--) {
    s += char;
  }

  return s + str;
}
