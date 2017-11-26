import { ValidationError, createNiceErrorMessage, uniqueErrorId } from './validation-error';

export const DOCUMENT_ERROR_TYPES = {
  INVALID_DOCUMENT: uniqueErrorId(),
  MISSING_MANDATORY_KEY: uniqueErrorId(),
  DISALLOWED_DATA_KEY: uniqueErrorId(),
  DISALLOWED_INCLUDED_KEY: uniqueErrorId(),
  UNKNOWN_KEY: uniqueErrorId(),
  VALUE_MUST_BE_OBJECT: uniqueErrorId(),
  VERSION_MUST_BE_STRING: uniqueErrorId(),
};

export class DocumentError extends ValidationError {
  constructor(errorType, key, value, path = '') {
    const isKeyError = true;
    const errorLocation = createNiceErrorMessage(key, value, '', isKeyError);
    const error = buildDocumentErrorMessage(errorType, key, value);
    const message = error + errorLocation;
    super(message);
  }
}

function buildDocumentErrorMessage(errorType, key, value) {
  return 'DocumentError';
}
