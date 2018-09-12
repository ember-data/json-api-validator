import { IErrorOptions } from "ember-data";

export class ValidationError extends Error {
  constructor(message: string) {
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

export const NICE_ERROR_TYPES = {
  KEY_ERROR: 1,
  VALUE_ERROR: 2,
  OBJECT_ERROR: 3,
};

export function createNiceErrorMessage(options: IErrorOptions) {
  let { key, value, path, code } = options;
  let parts, message, depth;

  switch (code) {
    case NICE_ERROR_TYPES.KEY_ERROR:
      parts = path.split('.').filter(i => i !== '');
      message = "\n\n\t{\n\t";
      depth = 2;

      for (let i = 0; i < parts.length; i++) {
        message += `${padLeft(parts[i], depth)}: {\n\t`;
        depth += 2;
      }

      message += `${padLeft(key, depth)}: ${typeof value === 'string' ? "'" + value + "'" : value}\n\t`;
      message += `${padLeft('^', depth, '-')}\n\n`;

      return message;

    case NICE_ERROR_TYPES.OBJECT_ERROR:
      parts = path.split('.').filter(i => i !== '');
      message = "\n\n\t" + String(value) + "\n";
      message += `${padLeft('^', 3, '-')}\n\n`;
      return message;

    case NICE_ERROR_TYPES.VALUE_ERROR:
      parts = path.split('.').filter(i => i !== '');
      message = "\n\n\t{\n\t";
      depth = 2;

      for (let i = 0; i < parts.length; i++) {
        message += `${padLeft(parts[i], depth)}: {\n\t`;
        depth += 2;
      }

      message += `${padLeft(key, depth)}: ${typeof value === 'string' ? "'" + value + "'" : value}\n\t`;
      depth += key.length + 2;
      message += `${padLeft('^', depth, '-')}\n\n`;

      return message;

    default:
      throw new Error('Cannot format error for unknown error code');
  }
}

function padLeft(str: string, count = 0, char = ' ') {
  let s = '';

  while (count--) {
    s += char;
  }

  return s + str;
}
