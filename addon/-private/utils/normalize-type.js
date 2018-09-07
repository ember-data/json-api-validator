import { singularize } from 'ember-inflector';
import { dasherize } from '@ember/string';

export default function normalizeType(str) {
  return singularize(dasherize(str));
}
