import { module, test, todo } from 'qunit';
import { setupTest }  from 'ember-qunit';
import DS from 'ember-data';
import PersonModel from 'dummy/models/person';
import AnimalModel from 'dummy/models/animal';
import PetModel from 'dummy/models/pet';
import DogModel from 'dummy/models/dog';
import FlyingDogModel from 'dummy/models/flying-dog';
import setupEmberDataValidations from 'dummy/setup-ember-data-validations';
import Ember from 'ember';

const { run } = Ember;

setupEmberDataValidations(DS.Store);

function registerModels(owner) {
  owner.register('model:person', PersonModel);
  owner.register('model:animal', AnimalModel);
  owner.register('model:pet', PetModel);
  owner.register('model:dog', DogModel);
  owner.register('model:flying-dog', FlyingDogModel);
}

let push;

module('Unit | Document', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    Ember.Test.adapter.exception = (e) => { throw e; };
    let store = this.store = this.owner.lookup('service:store');
    push = this.push = function push(data) {
      return run(() => { return store.push(data); });
    };
    registerModels(this.owner);

    let disallowHook = store.__validator.disallowOnlyMetaDocument;
    let allowHook = () => { return false; };

    store.__validator.disallowOnlyMetaDocument = allowHook;

    this.disallowMetaOnlyDocuments = () => { store.__validator.disallowOnlyMetaDocument = disallowHook; };
    this.allowMetaOnlyDocuments = () => { store.__validator.disallowOnlyMetaDocument = allowHook; };
  });

  module('Members', function() {
    test('a document MUST be an object', function(assert) {
      const VALID_DOC_ASSERT = ' is not a valid json-api document.';

      assert.throwsWith(() => { push() }, VALID_DOC_ASSERT, 'we throw for undefined');
      assert.throwsWith(() => { push(new Date()) }, VALID_DOC_ASSERT, 'we throw for a Date');
      assert.throwsWith(() => { push(null) }, VALID_DOC_ASSERT, 'we throw for null');
      assert.throwsWith(() => { push(true) }, VALID_DOC_ASSERT, 'we throw for Booleans');
      assert.throwsWith(() => { push('true') }, VALID_DOC_ASSERT, 'we throw for Strings');
      assert.throwsWith(() => { push(1) }, VALID_DOC_ASSERT, 'we throw for numbers');
      assert.doesNotThrowWith(() => { push({ data: null, meta: { pages: 0 } }) }, VALID_DOC_ASSERT, 'we do not throw for {}');
    });

    test('(ember-data) a json-api document MUST have `data` or `errors` in addition to `meta`', function(assert) {
      this.disallowMetaOnlyDocuments();
      const META_ONLY_ASSERT = 'ember-data does not enable json-api documents containing only `meta` as a member to be pushed to the store.';

      assert.throwsWith(() => { push({ data: undefined, meta: { pages: 0 } }) }, META_ONLY_ASSERT, 'we throw when other available members are undefined');
      assert.throwsWith(() => { push({ data: null, meta: { pages: 0 } }) }, META_ONLY_ASSERT, 'we throw when other available members are null');
      assert.throwsWith(() => { push({ meta: { pages: 0 } }) }, META_ONLY_ASSERT, 'we throw for meta-only documents');
      assert.doesNotThrowWith(() => { push({ data: { type: 'animal', id: '1', attributes: {} }, meta: { pages: 0 } }) }, META_ONLY_ASSERT, 'we do not throw when other members are defined');
    });

    test('a document MUST contain one of `data`, `errors`, or `meta` as a member', function(assert) {
      const VALID_MEMBERS_ASSERT = 'A json-api document MUST contain one of `data`, `meta` or `errors` as a member.';

      assert.throwsWith(() => { push({}) }, VALID_MEMBERS_ASSERT, 'we throw for empty');
      assert.throwsWith(() => { push({ foo: 'bar' }) }, VALID_MEMBERS_ASSERT, 'we throw when we have none of the members');
    });

    test('a document MUST contain one of `data`, `errors`, or `meta` as a non-null member', function(assert) {
      const VALID_MEMBERS_ASSERT = 'A json-api document MUST contain one of `data`, `meta` or `errors` as a non-null member.';

      assert.throwsWith(() => { push({ data: null, meta: undefined }) }, VALID_MEMBERS_ASSERT, 'we throw when the members are null or undefined');
      assert.throwsWith(() => { push({ data: null, meta: null }) }, VALID_MEMBERS_ASSERT, 'we throw when all members are null or undefined');
      assert.doesNotThrowWith(() => { push({ data: null, meta: { pages: 0 } }) }, VALID_MEMBERS_ASSERT, 'we do not throw when at least one member is available');
    });

    test('a document MUST NOT contain both `data` and `errors` as members', function(assert) {
      const VALID_DATA_ASSERT = 'A json-api document MUST NOT contain both `data` and `errors` as a members.';

      assert.throwsWith(() => { push({ data: { type: 'animal', id: '1', attributes: {} }, errors: null }) }, VALID_DATA_ASSERT, 'we throw when the members are null or undefined');
    });

    todo('a document MAY contain `jsonapi` `links` and `included` as members ', function(assert) {
      assert.notOk('Not Implemented');
    });

    todo('a document MUST NOT have the `included` member if `data` is not also present', function(assert) {
      assert.notOk('Not Implemented');
    });

    todo('(strict-mode) a document MUST NOT contain any non-spec members', function(assert) {
      assert.notOk('Not Implemented');
    });
  });

  module('Top-level Links', function() {
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

  module('Data', function() {
    todo('Collections MUST be uniformly resource-objects or resource-identifiers', function(assert) {
      assert.notOk('Not Implemented');
    });

    todo('(strict mode) Collection MUST be of a uniform type', function(assert) {
      assert.notOk('Not Implemented');
    });
  });

  module('Included', function() {
    todo('(strict mode) entries in included MUST NOT be resource-identifiers', function(assert) {
      assert.notOk('Not Implemented');
    });

    todo('(strict mode) entries MUST trace linkage to primary data', function(assert) {
      assert.notOk('Not Implemented');
    });

    todo('a document MUST ', function(assert) {
      assert.notOk('Not Implemented');
    });
  });

  module('Errors', function() {
    todo('a document MUST ', function(assert) {
      assert.notOk('Not Implemented');
    });
  });
});
