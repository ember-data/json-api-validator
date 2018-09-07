import isDasherized from './is-dasherized';

export default function assertMemberFormat(type, shouldDasherize = false) {
  let errors = [];

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
