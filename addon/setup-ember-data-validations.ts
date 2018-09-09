import DS, { ISchema } from 'ember-data';
import Validator from './-private/validator';
import { Document } from 'jsonapi-typescript';

const { Store } = DS;

export default function setupEmberDataValidations(_Store = Store as any) {
  _Store.reopen({
    init() {
      this._super();
      let store = this;

      this.__validator = new Validator({
        schemaImplements(subclassType, type) {
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

          const schema: ISchema = {

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

    validateJsonApiDocument(jsonApiDocument: Document) {
      this.__validator.validateDocument(jsonApiDocument);
    },

    _push(jsonApiDocument: Document) {
      this.validateJsonApiDocument(jsonApiDocument);
      return this._super(jsonApiDocument);
    }
  });
}
