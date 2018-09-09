import isPlainObject from '@ember-data/json-api-validator/-private/utils/is-plain-object';

/* global WeakMap */
export default function deepMerge(base, ...objects) {
  return _deepMerge(base, objects);
}

function isPrimitive(value) {
  return typeof value !== 'object' || value === null;
}

function _deepMerge(base, objects) {
  for (let i = 0; i < objects.length; i++) {
    let target = objects[i];
    let keys = Object.keys(target);

    for (let j = 0; j < keys.length; j++) {
      let key = keys[j];
      let value = target[key];
      let baseValue = base[key];

      if (base[key] === undefined) {
        base[key] = value;
      } else if (Array.isArray(value) || Array.isArray(baseValue)) {
        if (Array.isArray(baseValue) && Array.isArray(value)) {
          base[key] = value; // we just clobber arrays
          continue;
        }
        throw new Error('Unmergeable values');
      } else if (value === null || baseValue === null) {
        base[key] = value;
      } else if (!isPrimitive(baseValue) || !isPrimitive(value)) {
        if (isPlainObject(baseValue) && isPlainObject(value)) {
          _deepMerge(baseValue, [value]);
        } else {
          base[key] = value;
        }
      } else {
        base[key] = value;
      }
    }
  }

  return base;
}
