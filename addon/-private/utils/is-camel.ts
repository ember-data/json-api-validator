import { camelize } from '@ember/string';

export default function isCamel(str) {
  let camelized = camelize(str);

  return camelized === str;
}
