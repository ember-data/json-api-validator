import { DocumentError, DOCUMENT_ERROR_TYPES } from './errors/document-error';
import validateMeta from './validate-meta';
import memberPresent from '../utils/member-present';
import memberDefined from '../utils/member-defined';
import memberDefinedAndNotNull from "../utils/member-defined-and-not-null";

/**
 *
 * @param validator
 * @param document
 * @param issues
 * @param path
 * @returns {boolean}
 */
export default function validateJsonapiMember({
  validator,
  document,
  issues,
  path,
}) {
  let { errors } = issues;
  let hasError = false;

  if (memberPresent(document, 'jsonapi')) {
    if (!memberDefinedAndNotNull(document, 'jsonapi')) {
      errors.push(
        new DocumentError({
          code: DOCUMENT_ERROR_TYPES.VALUE_MUST_BE_OBJECT,
          value: document.jsonapi,
          member: 'jsonapi',
          path,
          document,
          validator,
        })
      );
    } else {
      let keys = Object.keys(document.jsonapi);

      /*
        The spec allows this to be empty, but we are more strict. If the jsonapi
        property is defined we expect it to have information.
       */
      if (keys.length === 0 || !memberDefined(document.jsonapi, 'version')) {
        errors.push(
          new DocumentError({
            code: DOCUMENT_ERROR_TYPES.MISSING_VERSION,
            value: document.jsonapi,
            member: 'jsonapi',
            path,
            document,
            validator,
          })
        );
        hasError = true;
      } else {
        /*
          The spec only allows for 'version' and 'meta'.
         */
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];

          if (key === 'version') {
            if (
              typeof document.jsonapi.version !== 'string' ||
              document.jsonapi.version.length === 0
            ) {
              errors.push(
                new DocumentError({
                  code: DOCUMENT_ERROR_TYPES.VERSION_MUST_BE_STRING,
                  value: document.jsonapi.version,
                  member: 'jsonapi',
                  path,
                  document,
                  validator,
                })
              );
              hasError = true;
            }
          } else if (key === 'meta') {
            hasError =
              !validateMeta({
                validator,
                document: document.jsonapi,
                originalDocument: document,
                issues,
                path: path + '.jsonapi',
              }) || hasError;
          } else {
            errors.push(
              new DocumentError({
                code: DOCUMENT_ERROR_TYPES.UNKNOWN_MEMBER,
                value: document.jsonapi.version,
                member: 'jsonapi',
                path,
                document,
                validator,
              })
            );
            hasError = true;
          }
        }
      }
    }
  }

  return !hasError;
}
