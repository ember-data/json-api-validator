import Ember from 'ember';
import DS from 'ember-data';
import Validator from 'json-api-validations/-private/validator';

const { singularize, dasherize } = Ember.String;
const { Store } = DS;

export default function setupEmberDataValidations(_Store = Store) {
  _Store.reopen({
    init() {
      this._super();
      let store = this;

      this.__validator = new Validator({
        formatType(type) {
          return dasherize(type);
        },
        // used to check for a schema by a slightly different name to be friendly
        formatFallbackType(type) {
          return singularize(dasherize(type));
        },
        isSubclassOf(subclassType, type) {
          try {
            let a = store.modelFor(type);
            let b = store.modelFor(subclassType);

            return a.detect(b);
          } catch (e) {
            return false;
          }
        },
        schemaFor(type) {
          let modelClass;

          try {
            modelClass = store.modelFor(type);
          } catch (e) {
            return undefined;
          }

          const schema = {

          };
          modelClass.eachRelationship((name, meta) => {
            let kind = meta.kind;
            schema[kind] = schema[kind] || [];
            schema[kind].push({
              key: name,
              schema: meta.type,
            });
          });
          modelClass.eachAttribute((name /*, meta*/) => {
            schema.attr = schema.attr || [];
            schema.attr.push(name);
          });

          return schema;
        }
      });
    },

    _push(jsonApiDocument) {
      let validator = this.__validator;
      let validationResponse = validator.validateDocument(jsonApiDocument);
      validator.throw(validationResponse);
      return this._super(jsonApiDocument);
    }
  });
}
