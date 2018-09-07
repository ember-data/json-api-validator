import isDasherized from './is-dasherized';
import isNormalizedType from './is-normalized-type';

export default function assertTypeFormat(type, formatter = isNormalizedType, shouldDasherize = true) {
  let formattedType = formatter(type);
  let errors = [];

  if (type !== formattedType) {
    errors.push('yes');
  }

  if (shouldDasherize) {
    if (!isDasherized(type)) {
      errors.push('dasherize');
    }
  } else {
    if (isDasherized(type)) {
      errors.push('whoops, dasherized');
    }
  }
}
