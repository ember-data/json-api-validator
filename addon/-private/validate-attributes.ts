import {
  AttributeError,
  ATTRIBUTE_ERROR_TYPES
} from "./errors/attribute-error";

export default function validateResourceAttributes(contextObject) {
  let {
      schema,
      attributes,
      /*methodName,*/
      path,
      validator } = contextObject;
    
  if (typeof attributes !== "object" || attributes === null) {
    return [
      new Error(
        `Expected the attributes hash for a resource to be an object, found '${attributes}'`
      )
    ];
  }

  let foundRelationshipKeys = Object.keys(attributes);
  let errors = [];

  for (let i = 0; i < foundRelationshipKeys.length; i++) {
    let key = foundRelationshipKeys[i];
    let data = attributes[key];
    let attr = findAttribute({ schema, key, validator });

    if (attr === undefined) {
      errors.push(
        new AttributeError(
          ATTRIBUTE_ERROR_TYPES.UNKNOWN_ATTRIBUTE,
          schema.type,
          key,
          data,
          path
        )
      );
    }

    if (typeof data === "undefined") {
      errors.push(
        new AttributeError(
          ATTRIBUTE_ERROR_TYPES.UNDEFINED_VALUE,
          schema.type,
          key,
          data,
          path
        )
      );
    }
  }

  return errors;
}

export function findAttribute({ schema, key: propertyName, validator }) {
  let arr = schema.attr;

  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === propertyName) {
        let meta = {};
        meta.key = propertyName;
        meta.kind = "attribute";
        meta.for = schema.type;
        return meta;
      }
    }
  }

  if (schema.inherits) {
    return findAttribute({
      schema: validator.schemaFor(schema.inherits),
      key: propertyName,
      validator
    });
  }

  return undefined;
}
