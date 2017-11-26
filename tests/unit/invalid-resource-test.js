import { module, todo } from 'qunit';
import { setupTest }  from 'ember-qunit';
import DS from 'ember-data';
import PersonModel from 'dummy/models/person';
import AnimalModel from 'dummy/models/animal';
import PetModel from 'dummy/models/pet';
import DogModel from 'dummy/models/dog';
import FlyingDogModel from 'dummy/models/flying-dog';
import setupEmberDataValidations from 'dummy/setup-ember-data-validations';

setupEmberDataValidations(DS.Store);

function registerModels(owner) {
  owner.register('model:person', PersonModel);
  owner.register('model:animal', AnimalModel);
  owner.register('model:pet', PetModel);
  owner.register('model:dog', DogModel);
  owner.register('model:flying-dog', FlyingDogModel);
}

module('Unit | Resource', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function(assert) {
    this.store = this.owner.lookup('service:store');
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
    todo('links MUST be an object if present', function(assert) {
      assert.notOk('Not Implemented');
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
