import { dasherize } from '@ember/string';

export default function isDasherized(str) {
  let dasherized = dasherize(str);

  return dasherized === str;
}
