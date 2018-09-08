import { module, todo, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Store from 'ember-data/store';
import PersonModel from 'dummy/models/person';
import AnimalModel from 'dummy/models/animal';
import PetModel from 'dummy/models/pet';
import DogModel from 'dummy/models/dog';
import FlyingDogModel from 'dummy/models/flying-dog';
import setupEmberDataValidations from '@ember-data/json-api-validator/setup-ember-data-validations';
import { run } from '@ember/runloop';
import deepCopy from '../helpers/deep-copy';

function buildDoc(base, extended) {
  return Object.assign({}, deepCopy(base), deepCopy(extended));
}

let StoreClass = Store.extend({});

setupEmberDataValidations(StoreClass);

function registerModels(owner) {
  owner.register('model:person', PersonModel);
  owner.register('model:animal', AnimalModel);
  owner.register('model:pet', PetModel);
  owner.register('model:dog', DogModel);
  owner.register('model:flying-dog', FlyingDogModel);
  owner.register('service:store', StoreClass);
}

module('Unit | Resource', function(hooks) {
  let push;
  let store;

  setupTest(hooks);

  hooks.beforeEach(function(assert) {
    store = this.owner.lookup('service:store');
    push = function push(data) {
      return run(() => {
        return store.push(data);
      });
    };
    registerModels(this.owner);

    assert.throwsWith = function throwsWith(testFn, message, label) {
      try {
        testFn();
        assert.ok(false, `${label}\n\nExpected Error:\t${message}\n\nActual Error:\t<<no error was thrown!>>`);
      } catch (e) {
        if (e.message.indexOf(message) !== -1) {
          assert.ok(true, `${label}`);
        } else {
          assert.ok(false, `${label}\n\nExpected Error:\t${message}\n\nActual Error:\t${e.message}`);
        }
      }
    };
  });

  module('Members', function() {
    todo('a resource MUST be an object', function(assert) {
      assert.notOk('Not Implemented');
    });
  });

  module('Type', function() {
    todo('a resource MUST ', function(assert) {
      assert.notOk('Not Implemented');
    });
  });

  module('Id', function() {

  });

  module('Links', function() {
    test('links MUST be an object if present', function(assert) {
      const VALID_MEMBER_ASSERT = ''
      let fakeDoc = { data: { type: 'animal', id: '1', attributes: {} } };
      let linksDoc1 = buildDoc(fakeDoc, { links: [] });
      let linksDoc2 = buildDoc(fakeDoc, { links: {}});
      let linksDoc3 = buildDoc(fakeDoc, { links: null });


      assert.throwsWith(
        () => {
          push(linksDoc1);
        },
        VALID_MEMBER_ASSERT,
        'we throw for links as array'
      );

      assert.doesNotThrowWith(
        () => {
          push(linksDoc2);
        },
        VALID_MEMBER_ASSERT,
        'we do not throw for links as object'
      );

      assert.throwsWith(
        () => {
          push(linksDoc3);
        },
        VALID_MEMBER_ASSERT,
        'we throw for links as null'
      );
    });

    todo('links MAY contain `self`, `related` and the pagination links `first`, `last`, `prev` and `next`', function(assert) {
      assert.notOk('Not Implemented');
    });

    todo('included `self` and `related` links MUST either be string URLs or an object with members `href` (a string URL) and an optional `meta` object', function(assert) {
      assert.notOk('Not Implemented');
    });

    todo('included pagination links MUST either be null, string URLs or an object with members `href` (a string URL) and an optional `meta` object', function(assert) {
      assert.notOk('Not Implemented');
    });

    todo('(strict-mode) links MAY NOT contain any non-spec members', function(assert) {
      assert.notOk('Not Implemented');
    });

    todo('a document MUST ', function(assert) {
      assert.notOk('Not Implemented');
    });
  });

  module('Attributes', function() {
    todo('a resource MUST ', function(assert) {
      assert.notOk('Not Implemented');
    });
  });

  module('Relationships', function() {
    todo('a resource MUST ', function(assert) {
      assert.notOk('Not Implemented');
    });
  });

  module('Errors', function() {
    todo('a resource MUST ', function(assert) {
      assert.notOk('Not Implemented');
    });
  });
});
