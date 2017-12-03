/* global console*/
import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import { start } from 'ember-cli-qunit';
import QUnit from 'qunit';

QUnit.assert.throwsWith = function throwsWith(testFn, message, label) {
  try {
    testFn();
    this.pushResult({
      result: false,
      actual: false,
      expected: true,
      message: `${label}\n\nExpected Error:\t${message}\n\nActual Error:\t<<no error was thrown!>>`
    });
  } catch (e) {
    /* eslint-disable no-console*/
    console.log(e);
    if (e.message.indexOf(message) !== -1) {
      this.pushResult({
        result: true,
        actual: true,
        expected: true,
        message: `${label}`
      });
    } else {
      this.pushResult({
        result: false,
        actual: false,
        expected: true,
        message: `${label}\n\nExpected Error:\t${message}\n\nActual Error:\t${e.message}`
      });
    }
  }
};

QUnit.assert.doesNotThrowWith = function doesNotThrowWith(testFn, message, label) {
  try {
    testFn();
    this.pushResult({
      result: true,
      actual: true,
      expected: true,
      message: `${label}`
    });
  } catch (e) {
    if (e.message.indexOf(message) !== -1) {
      console.log(e);
      this.pushResult({
        result: false,
        actual: false,
        expected: true,
        message: `${label}\n\nExpected No Error Containing:\t${message}\n\nDiscovered Error:\t${e.message}`
      });
    } else {
      console.log('Unexpected Error', e);
      this.pushResult({
        result: false,
        actual: true,
        expected: true,
        message: `${label}\n\n\tUnexpected Error:\t${e.message}`
      });
    }
  }
};

setResolver(resolver);
start();
