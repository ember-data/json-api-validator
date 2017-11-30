import { NICE_ERROR_TYPES, ValidationError, createNiceErrorMessage, uniqueErrorId } from './validation-error';

export const DOCUMENT_ERROR_TYPES = {
  INVALID_DOCUMENT: uniqueErrorId(),
  MISSING_MANDATORY_MEMBER: uniqueErrorId(),
  NULL_MANDATORY_MEMBER: uniqueErrorId(),
  DISALLOWED_DATA_MEMBER: uniqueErrorId(),
  DISALLOWED_SOLITARY_META_MEMBER: uniqueErrorId(),
  DISALLOWED_INCLUDED_MEMBER: uniqueErrorId(),
  UNKNOWN_MEMBER: uniqueErrorId(),
  VALUE_MUST_BE_OBJECT: uniqueErrorId(),
  VERSION_MUST_BE_STRING: uniqueErrorId(),
};

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

export class DocumentError extends ValidationError {
  constructor(options) {
    let { value, path, document } = options;
    const errorLocation = createNiceErrorMessage({
      key: Array.isArray(value) ? '' : value,
      value: isObject(document) ? JSON.stringify(document) : document,
      path,
      code: NICE_ERROR_TYPES.OBJECT_ERROR
    });
    const error = buildDocumentErrorMessage(options);
    const message = error + errorLocation;
    super(message);
  }
}

function aboutAnOxfordComma(array, quote = '`', joinWord = 'or') {
  let arr = array.slice();

  if (arr.length === 0) {
    throw new Error('No items to list from');
  }

  if (arr.length === 1) {
    return `${quote}${arr[0]}${quote}`;
  }

  let last = arr.pop();

  return quote + arr.join(quote + ', ' + quote) + quote + ' ' + joinWord + ' ' + quote + last + quote;
}

function buildDocumentErrorMessage(options) {
  let { value, code, document } = options;

  switch (code) {
    case DOCUMENT_ERROR_TYPES.INVALID_DOCUMENT:
      if (value === "object") {
        if (document instanceof Date) {
          value = "date";
        } else if (document === null) {
          value = "null";
        }
      }
      return `Value of type "${value}" is not a valid json-api document.`;

    case DOCUMENT_ERROR_TYPES.MISSING_MANDATORY_MEMBER:
      return `A json-api document MUST contain one of ${aboutAnOxfordComma(value)} as a member.`;

    case DOCUMENT_ERROR_TYPES.NULL_MANDATORY_MEMBER:
      return `A json-api document MUST contain one of ${aboutAnOxfordComma(value)} as a non-null member.`;

    case DOCUMENT_ERROR_TYPES.DISALLOWED_SOLITARY_META_MEMBER:
      return value;

    case DOCUMENT_ERROR_TYPES.DISALLOWED_DATA_MEMBER:
      return 'A json-api document MUST NOT contain both `data` and `errors` as a members.';

  }

  return 'DocumentError';
}
