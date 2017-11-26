/* global Symbol */
/* eslint-disable no-console */
export const DEBUG = true;

export const DEBUG_RESOURCE_SYMBOL = Symbol('___DEBUG_backingResource___');

export function assert(message, test) {
  if (!test) {
    throw new Error(message);
  }
}

export function warn(message, test) {
  if (!test) {
    console.warn(message);
  }
}

export function stripInProduction(fn) {
  try {
    fn();
  } catch (e) {
    const err = new Error("Error thrown in dev-only code-path");
    err.originalError = e;

    throw err;
  }
}
