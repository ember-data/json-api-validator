import { module, test, todo } from 'qunit';
import { setupTest } from 'ember-qunit';
import Store from 'ember-data/store';
import PersonModel from 'dummy/models/person';
import AnimalModel from 'dummy/models/animal';
import PetModel from 'dummy/models/pet';
import DogModel from 'dummy/models/dog';
import FlyingDogModel from 'dummy/models/flying-dog';
import setupEmberDataValidations from '@ember-data/json-api-validator/setup-ember-data-validations';
import { run } from '@ember/runloop';
import Ember from 'ember';
import deepCopy from '../helpers/deep-copy';
import deepMerge from '../helpers/deep-merge';

function buildDoc(base, extended) {
  return deepMerge({}, deepCopy(base), deepCopy(extended));
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

module('Unit | Document', function(hooks) {
  let push;
  let store;
  let validator;

  setupTest(hooks);

  hooks.beforeEach(function() {
    Ember.Test.adapter.exception = e => {
      throw e;
    };

    registerModels(this.owner);

    store = this.owner.lookup('service:store');
    push = function push(data) {
      return run(() => {
        return store.push(data);
      });
    };
    validator = store.__validator;

    let disallowHook = () => true;
    let allowHook = () => false;

    this.disallowMetaOnlyDocuments = () => {
      validator.disallowMetaOnlyDocuments = disallowHook;
    };
    this.allowMetaOnlyDocuments = () => {
      validator.disallowMetaOnlyDocuments = allowHook;
    };
    this.disallowMetaOnlyRelationships = () => {
      validator.disallowMetaOnlyRelationships = disallowHook;
    };
    this.allowMetaOnlyRelationships = () => {
      validator.disallowMetaOnlyRelationships = allowHook;
    };
    this.enableStrictMode = () => {
      validator.strictMode = true;
    };
    this.disableStrictMode = () => {
      validator.strictMode = false;
    };
  });

  module('Members', function() {
    test('a document MUST be an object', function(assert) {
      this.allowMetaOnlyDocuments();
      const VALID_DOC_ASSERT = ' is not a valid json-api document.';

      assert.throwsWith(
        () => {
          push();
        },
        VALID_DOC_ASSERT,
        'we throw for undefined'
      );
      assert.throwsWith(
        () => {
          push(new Date());
        },
        VALID_DOC_ASSERT,
        'we throw for a Date'
      );
      assert.throwsWith(
        () => {
          push(null);
        },
        VALID_DOC_ASSERT,
        'we throw for null'
      );
      assert.throwsWith(
        () => {
          push(true);
        },
        VALID_DOC_ASSERT,
        'we throw for Booleans'
      );
      assert.throwsWith(
        () => {
          push('true');
        },
        VALID_DOC_ASSERT,
        'we throw for Strings'
      );
      assert.throwsWith(
        () => {
          push(1);
        },
        VALID_DOC_ASSERT,
        'we throw for numbers'
      );
      assert.doesNotThrowWith(
        () => {
          push({ data: null, meta: { pages: 0 } });
        },
        VALID_DOC_ASSERT,
        'we do not throw for {}'
      );
    });

    test('a document MUST contain one of `data`, `errors`, or `meta` as a member', function(assert) {
      this.allowMetaOnlyDocuments();
      const VALID_MEMBERS_ASSERT =
        'A json-api document MUST contain one of `data`, `meta` or `errors` as a member.';

      assert.throwsWith(
        () => {
          push({});
        },
        VALID_MEMBERS_ASSERT,
        'we throw for empty'
      );
      assert.throwsWith(
        () => {
          push({ foo: 'bar' });
        },
        VALID_MEMBERS_ASSERT,
        'we throw when we have none of the members'
      );
    });

    test('a document MUST contain one of `data`, `errors`, or `meta` as a non-null member', function(assert) {
      this.allowMetaOnlyDocuments();
      const VALID_MEMBERS_ASSERT =
        'A json-api document MUST contain one of `data`, `meta` or `errors` as a non-null member.';

      assert.throwsWith(
        () => {
          push({ data: null, meta: undefined });
        },
        VALID_MEMBERS_ASSERT,
        'we throw when the members are null or undefined'
      );
      assert.throwsWith(
        () => {
          push({ data: null, meta: null });
        },
        VALID_MEMBERS_ASSERT,
        'we throw when all members are null or undefined'
      );
      assert.doesNotThrowWith(
        () => {
          push({ data: null, meta: { pages: 0 } });
        },
        VALID_MEMBERS_ASSERT,
        'we do not throw when at least one member is available'
      );
    });

    test('a document MUST NOT contain both `data` and `errors` as members', function(assert) {
      const VALID_DATA_ASSERT =
        'A json-api document MUST NOT contain both `data` and `errors` as a members.';

      assert.throwsWith(
        () => {
          push({
            data: { type: 'animal', id: '1', attributes: {} },
            errors: null,
          });
        },
        VALID_DATA_ASSERT,
        'we throw when the members are null or undefined'
      );
    });

    test('a document MAY contain `jsonapi` `links` and `included` as members ', function(assert) {
      const VALID_MEMBER_ASSERT = '';
      let fakeDoc = { data: { type: 'animal', id: '1', attributes: {} } };
      let linksDoc = buildDoc(fakeDoc, { links: {} });
      let jsonApiDoc = buildDoc(fakeDoc, { jsonapi: { version: '1.0' } });
      let includedDoc = buildDoc(fakeDoc, { included: [] });
      let allDoc = buildDoc(fakeDoc, {
        links: {},
        jsonapi: { version: '1.0' },
        included: [],
      });

      assert.doesNotThrowWith(
        () => {
          push(linksDoc);
        },
        VALID_MEMBER_ASSERT,
        'we do not throw for links'
      );
      assert.doesNotThrowWith(
        () => {
          push(jsonApiDoc);
        },
        VALID_MEMBER_ASSERT,
        'we do not throw for jsonapi'
      );
      assert.doesNotThrowWith(
        () => {
          push(includedDoc);
        },
        VALID_MEMBER_ASSERT,
        'we do not throw for included'
      );
      assert.doesNotThrowWith(
        () => {
          push(allDoc);
        },
        VALID_MEMBER_ASSERT,
        'we do not throw for all present'
      );
    });

    test('a document MUST NOT have the `included` member if `data` is not also present', function(assert) {
      this.disallowMetaOnlyDocuments();
      this.enableStrictMode();
      const INVALID_INCLUDED_ASSERT =
        'A json-api document MUST NOT contain `included` as a member unless `data` is also present.';
      let dataAndIncludedDoc = {
        data: { type: 'animal', id: '1', attributes: {} },
        included: [],
      };
      let includedOnlyDoc = {
        meta: { pages: 0 },
        included: [],
      };

      assert.doesNotThrowWith(
        () => {
          push(dataAndIncludedDoc);
        },
        INVALID_INCLUDED_ASSERT,
        'we do not throw for included'
      );
      assert.throwsWith(
        () => {
          push(includedOnlyDoc);
        },
        INVALID_INCLUDED_ASSERT,
        'we do not throw for included'
      );
    });

    test('a document MUST NOT contain any non-spec members', function(assert) {
      this.enableStrictMode();
      const VALID_MEMBER_ASSERT =
        'is not a valid member of a json-api document.';
      let baseDoc = { data: { type: 'animal', id: '1', attributes: {} } };
      let fakeDoc1 = buildDoc(baseDoc, { unknownMember: undefined });
      let fakeDoc2 = buildDoc(baseDoc, { unknownMember: null });
      let fakeDoc3 = buildDoc(baseDoc, { unknownMember: {} });

      assert.throwsWith(
        () => {
          push(fakeDoc1);
        },
        VALID_MEMBER_ASSERT,
        'We throw for unexpected members'
      );
      assert.throwsWith(
        () => {
          push(fakeDoc2);
        },
        VALID_MEMBER_ASSERT,
        'We throw for unexpected members'
      );
      assert.throwsWith(
        () => {
          push(fakeDoc3);
        },
        VALID_MEMBER_ASSERT,
        'We throw for unexpected members'
      );
    });

    test('(loose-mode) a document SHOULD NOT contain any non-spec members', function(assert) {
      this.disableStrictMode();
      const VALID_MEMBER_ASSERT =
        'is not a valid member of a json-api document.';
      let baseDoc = { data: { type: 'animal', id: '1', attributes: {} } };
      let fakeDoc1 = buildDoc(baseDoc, { unknownMember: undefined });
      let fakeDoc2 = buildDoc(baseDoc, { unknownMember: null });
      let fakeDoc3 = buildDoc(baseDoc, { unknownMember: {} });

      assert.doesNotThrowWith(
        () => {
          push(fakeDoc1);
        },
        VALID_MEMBER_ASSERT,
        'We do not throw for unexpected members'
      );
      assert.expectWarning(
        () => {
          push(fakeDoc1);
        },
        VALID_MEMBER_ASSERT,
        'We warn for unexpected members'
      );
      assert.doesNotThrowWith(
        () => {
          push(fakeDoc2);
        },
        VALID_MEMBER_ASSERT,
        'We do not throw for unexpected members'
      );
      assert.expectWarning(
        () => {
          push(fakeDoc2);
        },
        VALID_MEMBER_ASSERT,
        'We warn for unexpected members'
      );
      assert.doesNotThrowWith(
        () => {
          push(fakeDoc3);
        },
        VALID_MEMBER_ASSERT,
        'We do not throw for unexpected members'
      );
      assert.expectWarning(
        () => {
          push(fakeDoc3);
        },
        VALID_MEMBER_ASSERT,
        'We warn for unexpected members'
      );
    });
  });

  module('Top-level jsonapi member', function() {
    test('MUST contain version', function(assert) {
      let baseDoc = { data: { type: 'animal', id: '1', attributes: {} } };
      let fakeDoc1 = buildDoc(baseDoc, { jsonapi: undefined });
      let fakeDoc2 = buildDoc(baseDoc, { jsonapi: null });
      let fakeDoc3 = buildDoc(baseDoc, { jsonapi: {} });
      let fakeDoc4 = buildDoc(baseDoc, { jsonapi: { version: '1.0.0' } });

      assert.throwsWith(
        () => {
          push(fakeDoc1);
        },
        `expected the 'jsonapi' member present in the json-api document to be an object, found value of type undefined`,
        'We throw when the value is explicitly undefined'
      );
      assert.throwsWith(
        () => {
          push(fakeDoc2);
        },
        `expected the 'jsonapi' member present in the json-api document to be an object, found value of type Null`,
        'We throw when the value is null'
      );
      assert.throwsWith(
        () => {
          push(fakeDoc3);
        },
        `expected a 'version' member to be present in the 'document.jsonapi' object`,
        'We throw when missing version'
      );
      assert.doesNotThrowWith(
        () => {
          push(fakeDoc4);
        },
        `expected a 'version' member to be present in the 'document.jsonapi'`,
        'We do not throw when version is present'
      );
    });

    test('MAY contain meta', function(assert) {
      let baseDoc = {
        data: { type: 'animal', id: '1', attributes: {} },
        jsonapi: { version: '1.0.0' },
      };
      let fakeDoc1 = buildDoc(baseDoc, { jsonapi: { meta: undefined } });
      let fakeDoc2 = buildDoc(baseDoc, { jsonapi: { meta: null } });
      let fakeDoc3 = buildDoc(baseDoc, { jsonapi: { meta: {} } });
      let fakeDoc4 = buildDoc(baseDoc, {
        jsonapi: { meta: { features: ['rfc-293'] } },
      });

      assert.throwsWith(
        () => {
          push(fakeDoc1);
        },
        `'<document>.jsonapi.meta' MUST be an object when present: found value of type undefined`,
        'We throw when the value is explicitly undefined'
      );
      assert.throwsWith(
        () => {
          push(fakeDoc2);
        },
        `'<document>.jsonapi.meta' MUST be an object when present: found value of type Null`,
        'We throw when the value is null'
      );
      assert.throwsWith(
        () => {
          push(fakeDoc3);
        },
        `'<document>.jsonapi.meta' MUST have at least one member: found an empty object.`,
        'We throw when we have no keys'
      );
      assert.doesNotThrowWith(
        () => {
          push(fakeDoc4);
        },
        `'<document>.jsonapi.meta' MUST`,
        'We do not throw when at least one key is present'
      );
    });
    todo('MUST NOT contain other members', function(assert) {
      assert.notOk('Not Implemented');
    });
  });

  module('Top-level meta', function() {
    test('meta must be well-formed', function(assert) {
      let baseDoc = {
        data: { type: 'animal', id: '1', attributes: {} },
      };
      let fakeDoc1 = buildDoc(baseDoc, { meta: undefined });
      let fakeDoc2 = buildDoc(baseDoc, { meta: null });
      let fakeDoc3 = buildDoc(baseDoc, { meta: {} });
      let fakeDoc4 = buildDoc(baseDoc, {
        meta: { features: ['rfc-293'] },
      });

      assert.throwsWith(
        () => {
          push(fakeDoc1);
        },
        `'<document>.meta' MUST be an object when present: found value of type undefined`,
        'We throw when the value is explicitly undefined'
      );
      assert.throwsWith(
        () => {
          push(fakeDoc2);
        },
        `'<document>.meta' MUST be an object when present: found value of type Null`,
        'We throw when the value is null'
      );
      assert.throwsWith(
        () => {
          push(fakeDoc3);
        },
        `'<document>.meta' MUST have at least one member: found an empty object.`,
        'We throw when we have no keys'
      );
      assert.doesNotThrowWith(
        () => {
          push(fakeDoc4);
        },
        `'<document>.meta' MUST`,
        'We do not throw when at least one key is present'
      );
    });

    test('(ember-data-quirk) a json-api document MUST have `data` or `errors` in addition to `meta`', function(assert) {
      this.disallowMetaOnlyDocuments();
      const META_ONLY_ASSERT =
        "'<document>.meta' MUST NOT be the only member of '<document>. Expected `data` or `errors` as a sibling.";

      assert.throwsWith(
        () => {
          push({ data: undefined, meta: { pages: 0 } });
        },
        META_ONLY_ASSERT,
        'we throw when other available members are undefined'
      );
      assert.throwsWith(
        () => {
          push({ data: null, meta: { pages: 0 } });
        },
        META_ONLY_ASSERT,
        'we throw when other available members are null'
      );
      assert.throwsWith(
        () => {
          push({ meta: { pages: 0 } });
        },
        META_ONLY_ASSERT,
        'we throw for meta-only documents'
      );
      assert.doesNotThrowWith(
        () => {
          push({
            data: { type: 'animal', id: '1', attributes: {} },
            meta: { pages: 0 },
          });
        },
        META_ONLY_ASSERT,
        'we do not throw when other members are defined'
      );
    });
  });

  module('Top-level Links', function() {
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

    todo(
      'links MAY contain `self`, `related` and the pagination links `first`, `last`, `prev` and `next`',
      function(assert) {
        assert.notOk('Not Implemented');
      }
    );

    todo(
      'included `self` and `related` links MUST either be string URLs or an object with members `href` (a string URL) and an optional `meta` object',
      function(assert) {
        assert.notOk('Not Implemented');
      }
    );

    todo(
      'included pagination links MUST either be null, string URLs or an object with members `href` (a string URL) and an optional `meta` object',
      function(assert) {
        assert.notOk('Not Implemented');
      }
    );

    todo('(strict-mode) links MAY NOT contain any non-spec members', function(
      assert
    ) {
      assert.notOk('Not Implemented');
    });

    todo('a document MUST ', function(assert) {
      assert.notOk('Not Implemented');
    });
  });

  module('Data', function() {
    todo(
      'Collections MUST be uniformly resource-objects or resource-identifiers',
      function(assert) {
        assert.notOk('Not Implemented');
      }
    );

    todo('(strict mode) Collection MUST be of a uniform type', function(
      assert
    ) {
      assert.notOk('Not Implemented');
    });
  });

  module('Included', function() {
    todo(
      '(strict mode) entries in included MUST NOT be resource-identifiers',
      function(assert) {
        assert.notOk('Not Implemented');
      }
    );

    todo('(strict mode) entries MUST trace linkage to primary data', function(
      assert
    ) {
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
