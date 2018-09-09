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
}
