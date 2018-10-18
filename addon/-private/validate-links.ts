import { LinksError, LINKS_ERROR_TYPES} from './errors/links-error';
import memberPresent from './utils/member-present';
import isPlainObject from './utils/is-plain-object';
/**
 * `links` MUST be an object if present
 * each member MUST be a string URL or a link-object
 * each link-object MUST have an `href` string URL
 *   and MAY  have a meta object.
 *
 * For top level documents (here), the links-object MAY contain
 *
 * - self: the link to the current document
 * - related: when the data represents a resource relationship
 * - pagination links: for the primary data
 *
 * The following keys MUST be used for pagination links:
 *
 * first: the first page of data
 * last: the last page of data
 * prev: the previous page of data
 * next: the next page of data
 *
 * Keys MUST either be omitted or have a `null` value to indicate that a particular link is unavailable.
 *
 * @param document
 * @param validator
 * @param target
 * @param issues
 * @param path
 * @returns {boolean}
 */

export default function validateLinks({ document, validator, target, issues, path }) {
  let { errors } = issues;
  function triggerError(code) {
    errors.push(new LinksError({
      code,
      value: target.links,
      member: 'links',
      target,
      validator,
      document,
      path
    }));
  }

  if (memberPresent(target, 'links')) {
    if (!isPlainObject(target.links)) {
      triggerError(LINKS_ERROR_TYPES.VALUE_MUST_BE_OBJECT);

      return false;
    } else if (Object.keys(target.links).length === 0) {
      triggerError(LINKS_ERROR_TYPES.OBJECT_MUST_NOT_BE_EMPTY);

      return false;
    } else if (target.links.self) {
      const self = target.links.self;

      if (!isPlainObject(self) && typeof self !== 'string') {
        triggerError(LINKS_ERROR_TYPES.INVALID_SELF);

        return false;
      }

      if (self.href && typeof self.href !== 'string') {
        triggerError(LINKS_ERROR_TYPES.INVALID_SELF);

        return false;
      }
    } else if (target.links.related) {
      const related = target.links.related;

      if (!isPlainObject(related) && typeof related !== 'string') {
        triggerError(LINKS_ERROR_TYPES.INVALID_RELATED);

        return false;
      }
    } else if (target.links.first || target.links.next || target.links.prev || target.links.last) {
      const pagination = [
        target.links.first,
        target.links.next,
        target.links.prev,
        target.links.last,
      ];

      pagination.forEach((link) => {
        if (link) {
          if (typeof link !== 'string' && !isPlainObject(link)) {
            triggerError(LINKS_ERROR_TYPES.INVALID_PAGINATION);

            return false;
          }

          return true;
        } else {
          if (link === null) {
            return true;
          } else {
            triggerError(LINKS_ERROR_TYPES.INVALID_PAGINATION);

            return false;
          }
        }
      });
    }
  }
  return true;
}
