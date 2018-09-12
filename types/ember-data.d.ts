import JSONAPIValidator from "@ember-data/json-api-validator/-private/validator";
import { Document } from "jsonapi-typescript";
import { DocumentError } from "@ember-data/json-api-validator/-private/errors/document-error";

/**
 * Catch-all for ember-data.
 */
declare module 'ember-data' {
  interface ModelRegistry {
    [key: string]: any;
  }

  interface ISchemaEntry {
    key: string;
    schema: string;
  }

  interface ISchemaAttributes {
    attr?: string[];
  }

  type ISchema =
    & { [kind: string]: Array<ISchemaEntry>; }
    & ISchemaAttributes;

  interface IErrorOptions {
    key: string;
    value: string;
    path: string;
    code: number;
    member?: string;
    document?: Document;
    validator?: JSONAPIValidator;
  }

  interface IIssues {
    errors: DocumentError[];
    warnings: string[];
  }

  interface IValidationContext {
    validator: JSONAPIValidator;
    document: Document | null | Date;
    target: Document;
    issues: IIssues;
    path: string;
    requiredSiblings?: any
  }

  interface IObject {
    [member: string]: any
  }
}
