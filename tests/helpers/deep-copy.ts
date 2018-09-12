/* global WeakMap */
export default function deepCopy(obj: object) {
  return _deepCopy(obj, new WeakMap());
}

function isPrimitive(value: any) {
  return typeof value !== 'object' || value === null;
}

function _deepCopy<T>(oldObject: T, seen: WeakMap<any, any>): T {
  if (Array.isArray(oldObject)) {
    return copyArray<any>(oldObject, seen) as any;
  } else if (!isPrimitive(oldObject)) {
    return copyObject(oldObject, seen);
  } else {
    return oldObject;
  }
}

function copyObject<T extends any>(oldObject: T, seen: WeakMap<any, any>): T {
  let newObject: any = {};

  Object.keys(oldObject).forEach(key => {
    let value = oldObject[key];
    let newValue = isPrimitive(value) ? value : seen.get(value);

    if (value && newValue === undefined) {
      newValue = newObject[key] = _deepCopy(value, seen);
      seen.set(value, newValue);
    }

    newObject[key] = newValue;
  });

  return newObject;
}

function copyArray<T>(oldArray: Array<T>, seen: WeakMap<any, any>): Array<T> {
  let newArray = [];

  for (let i = 0; i < oldArray.length; i++) {
    let value = oldArray[i];
    let newValue = isPrimitive(value) ? value : seen.get(value);

    if (value && newValue === undefined) {
      newValue = newArray[i] = _deepCopy(value, seen);
      seen.set(value, newValue);
    }

    newArray[i] = newValue;
  }

  return newArray;
}
